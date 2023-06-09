import homePage from './page/home.js'
import Utils from './utils.js'

const HomePage = (new homePage()).init()


Utils._('.left').onclick = () => {
    var enc = encrypt(Utils._('#output').innerHTML, 'senha123')
    var dec = decrypt(enc, 'senha123')

    console.log("AES:: ", enc, dec)
}