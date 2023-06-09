class UtilsClass {

    constructor() {
        this.reset()
    }

    reset() {
        this.node = {
            a: null,
            f: null
        }
        this.file = {
            url: null,
            name: 'Data',
            type: 'application/json',
            typeOnSave: 'application/json',
            size: 0,
            content: null
        }
    }

    load (output) {
        this.node.f = this._c('input')
        this.node.f.type = 'file'
        this.node.f.accept = 'application/json'
        this.node.f.onchange = async (e) => {
            e.preventDefault()
            var file = e.target.files[0]

            if(file.type !== 'application/json' && 
                file.type !== 'text/plain' &&
                file.size > 9999999) {
                alert('Invalid file type or size too large!\nSize: ' + file.size + '\nType: ' + file.type)
                return this.reset()
            }

            output.innerHTML = ''

            try{
                var enc = await file.text()
                var dec = decrypt(enc, Utils._('#hdr-pass').value)
                // TODO: flag GREEN on display  
                // Usar JSON.parse(dec) para validar e carregar os dados.            
            } catch(e) { 
                alert('Invalid password!')
                dec = enc
                // TODO: flag RED on display
                // Usar JSON.parse(dec) para validar e carregar os dados de um arquivo sem criptografia
            }
            this.file.content = dec

            this.file.name = file.name.replace(/\.[^/.]+$/, "")      // remove extension
                                      .replace(/[^a-zA-Z0-9_]/g, '') // remove special characters
                                      .replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase()) // capitalize first letter
            this.file.size = file.size
            this.file.type = file.type

            output.innerHTML = this.file.content
        }
        this.node.f.click()
    }

    save(text) {
        var enc = encrypt(text, Utils._('#hdr-pass').value)
        this.node.a = this._c('a')
        this.node.a.href = this.createBlob(enc)
        this.node.a.download = this.file.name + '.json'
        this.node.a.click()
    }

    // Utils :P --------------------------------------
    createBlob(text) {
        if (this.file.url !== null) window.URL.revokeObjectURL(this.file.url)
        
        // Creates a new blob object and assigns it to the file.url property
        this.file.url = window.URL.createObjectURL(new Blob([text], {type: this.file.typeOnSave}))

        return this.file.url
    }

    _(element, root) { return (root ? root : document).querySelector(element) || false }
    _a(element, root) { return (root ? root : document).querySelectorAll(element) || false }
    _c(element, root) { 
        var e = document.createElement(element)
        return (root ? root.appendChild(e) : e) 
    }
}

const Utils = new UtilsClass()
export default Utils