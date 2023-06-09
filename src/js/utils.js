class UtilsClass {

    constructor() {
        this.resetFile()
    }

    resetFile() {
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
        var f = this._c('input')
        f.type = 'file'
        f.accept = 'application/json'
        f.onchange = async (e) => {
            e.preventDefault()
            var file = e.target.files[0]

            if(file.type !== 'application/json') {
                alert('Invalid file type')
                return this.resetFile()
            }

            this.file.content = await file.text()
            this.file.name = file.name.replace(/\.[^/.]+$/, "")      // remove extension
                                      .replace(/[^a-zA-Z0-9_]/g, '') // remove special characters
                                      .replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase()) // capitalize first letter
            this.file.size = file.size
            this.file.type = file.type

            output.innerHTML = this.file.content
        }
        f.click()
    }

    save(text) {
        var a  = this._c('a')
        a.href = this.createBlob(text)
        a.download = this.file.name + '.json'
        a.click()
    }

    // Utils :P --------------------------------------
    createBlob(text) {
        let d = new Blob([text], {type: this.file.typeOnSave})

        // If a file has been previously generated, revoke the existing URL
        if (this.file.url !== null) window.URL.revokeObjectURL(this.file.url)

        this.file.url = window.URL.createObjectURL(d)
        // Returns a reference to the global variable holding the URL
        // Again, this is better than generating and returning the URL itself from the function as it will eat memory if the file contents are large or regularly changing
        return this.file.url
    }

    _(element, root) { return (root ? root : document).querySelector(element) || false }
    _a(element, root) { return (root ? root : document).querySelectorAll(element) || false }
    _c(element, root) { return (root ? root : document).createElement(element) || false }
}