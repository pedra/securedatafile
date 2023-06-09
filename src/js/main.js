let Utils,
    hdrLoad,
    hdrSave,
    output,
    TMP

window.onload = () => {    
    Utils = new UtilsClass()

    hdrLoad = Utils._('#hdr-load')
    hdrSave = Utils._('#hdr-save')
    output = Utils._('#output')

    hdrSave.onclick = e => Utils.save(output.innerText)
    hdrLoad.onclick = e => Utils.load(output)
}

