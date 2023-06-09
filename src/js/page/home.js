import Utils from '../utils.js'

class homePage {
    constructor() {
        this.output = Utils._('#output')
        this.hdrLoad = Utils._('#hdr-load')
        this.hdrSave = Utils._('#hdr-save')
    }
    
    init() {        
        this.hdrLoad.onclick = e => Utils.load(this.output)
        this.hdrSave.onclick = e => Utils.save(this.output.innerText)
        return this
    }
}

export default homePage