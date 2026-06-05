// ESC/POS Termal printer utility
// WebUSB orqali bevosita printer ga chop etish

export interface ReceiptData {
  orderNumber: number
  items: { name: string; price: number; quantity: number }[]
  total: number
  paymentMethod: string
  tableNumber?: number
  type: string
  time: Date
  cashGiven?: number
  change?: number
}

// ESC/POS commands
const ESC = 0x1B
const GS = 0x1D
const INIT = [ESC, 0x40]
const CENTER = [ESC, 0x61, 0x01]
const LEFT = [ESC, 0x61, 0x00]
const BOLD_ON = [ESC, 0x45, 0x01]
const BOLD_OFF = [ESC, 0x45, 0x00]
const DOUBLE_HEIGHT = [GS, 0x21, 0x11]
const NORMAL_SIZE = [GS, 0x21, 0x00]
const CUT = [GS, 0x56, 0x00]
const FEED = [ESC, 0x64, 0x03]

function textToBytes(text: string): number[] {
  return Array.from(new TextEncoder().encode(text))
}

function line(text: string, width = 32): number[] {
  return textToBytes(text.substring(0, width).padEnd(width) + '\n')
}

function divider(char = '-', width = 32): number[] {
  return textToBytes(char.repeat(width) + '\n')
}

function twoCol(left: string, right: string, width = 32): number[] {
  const l = left.substring(0, width - right.length - 1)
  return textToBytes(l + ' '.repeat(width - l.length - right.length) + right + '\n')
}

export function buildReceipt(data: ReceiptData): Uint8Array {
  const buf: number[] = []
  const push = (arr: number[]) => buf.push(...arr)

  push(INIT)
  push(CENTER)
  push(BOLD_ON)
  push(DOUBLE_HEIGHT)
  push(textToBytes('OSHXONA POS\n'))
  push(NORMAL_SIZE)
  push(BOLD_OFF)
  push(divider('='))
  push(textToBytes(
    (data.type === 'dine-in' ? `STOL ${data.tableNumber}` :
     data.type === 'takeaway' ? 'OLIB KETISH' : 'DOSTAVKA') + '\n'
  ))
  push(LEFT)
  push(textToBytes(`Chek: #${data.orderNumber}\n`))
  push(textToBytes(`Vaqt: ${data.time.toLocaleTimeString('uz')}\n`))
  push(divider())
  
  data.items.forEach(item => {
    push(textToBytes(`${item.name.substring(0,20)}\n`))
    push(twoCol(`  ${item.quantity} x ${item.price.toLocaleString()}`, `${(item.price*item.quantity).toLocaleString()}`))
  })
  
  push(divider())
  push(BOLD_ON)
  push(twoCol('JAMI:', `${data.total.toLocaleString()} uzs`))
  push(BOLD_OFF)
  
  if (data.paymentMethod === 'cash' && data.cashGiven) {
    push(twoCol("To'landi:", `${data.cashGiven.toLocaleString()}`))
    push(twoCol('Qaytim:', `${(data.change || 0).toLocaleString()}`))
  }
  
  push(divider('='))
  push(CENTER)
  push(textToBytes('* RAHMAT! *\n'))
  push(textToBytes('Yana keling!\n'))
  push(FEED)
  push(CUT)

  return new Uint8Array(buf)
}

// WebUSB printer connection
let printerDevice: USBDevice | null = null

export async function connectThermalPrinter(): Promise<boolean> {
  try {
    const device = await navigator.usb.requestDevice({
      filters: [
        { vendorId: 0x04B8 }, // Epson
        { vendorId: 0x0519 }, // Star
        { vendorId: 0x154F }, // CITIZEN
        { vendorId: 0x0483 }, // Generic
        { vendorId: 0x6868 }, // Generic POS
      ]
    })
    await device.open()
    if (device.configuration === null) await device.selectConfiguration(1)
    await device.claimInterface(0)
    printerDevice = device
    return true
  } catch (e) {
    console.error('Printer connect error:', e)
    return false
  }
}

export async function printReceipt(data: ReceiptData): Promise<boolean> {
  const bytes = buildReceipt(data)
  
  // WebUSB printer
  if (printerDevice) {
    try {
      await printerDevice.transferOut(1, bytes)
      return true
    } catch (e) {
      console.error('Print error:', e)
    }
  }
  
  // Fallback: browser print
  browserPrint(data)
  return true
}

export function browserPrint(data: ReceiptData) {
  const w = window.open('', '_blank', 'width=380,height=600')
  if (!w) return
  const payLabel = data.paymentMethod === 'cash' ? 'Naqd pul' : data.paymentMethod === 'card' ? 'Karta' : 'Transfer'
  w.document.write(`<!DOCTYPE html><html><head><title>Chek #${data.orderNumber}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Courier New',monospace;font-size:13px;width:300px;padding:12px;background:white}
      .center{text-align:center}.bold{font-weight:bold}.big{font-size:20px;font-weight:900}
      .row{display:flex;justify-content:space-between;margin:2px 0}
      .divider{border-top:1px dashed #000;margin:6px 0}
      .title{font-size:18px;font-weight:900;letter-spacing:2px}
    </style></head><body>
    <div class="center">
      <div class="title">OSHXONA POS</div>
      <div class="bold">${data.type==='dine-in'?`STOL ${data.tableNumber}`:data.type==='takeaway'?'OLIB KETISH':'DOSTAVKA'}</div>
      <div class="divider"></div>
    </div>
    <div class="row"><span>Chek:</span><span class="bold">#${data.orderNumber}</span></div>
    <div class="row"><span>Vaqt:</span><span>${data.time.toLocaleTimeString('uz')}</span></div>
    <div class="divider"></div>
    ${data.items.map(i=>`
      <div>${i.name}</div>
      <div class="row"><span>  ${i.quantity} × ${i.price.toLocaleString()}</span><span class="bold">${(i.price*i.quantity).toLocaleString()}</span></div>
    `).join('')}
    <div class="divider"></div>
    <div class="row bold big"><span>JAMI:</span><span>${data.total.toLocaleString()} uzs</span></div>
    <div class="row"><span>To'lov:</span><span>${payLabel}</span></div>
    ${data.paymentMethod==='cash'&&data.cashGiven?`
      <div class="row"><span>Berildi:</span><span>${data.cashGiven.toLocaleString()}</span></div>
      <div class="row bold"><span>Qaytim:</span><span>${(data.change||0).toLocaleString()}</span></div>
    `:''}
    <div class="divider"></div>
    <div class="center bold">* RAHMAT! *</div>
    <div class="center">Yana keling! 🙏</div>
  </body></html>`)
  w.document.close()
  setTimeout(() => { w.print(); setTimeout(() => w.close(), 1000) }, 300)
}

export function isPrinterConnected(): boolean {
  return printerDevice !== null
}
