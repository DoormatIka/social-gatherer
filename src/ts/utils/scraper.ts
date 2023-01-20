// twitch title       | class   = CoreText-sc-1txzju1-0 gBAboc
// twitch description | class   = ScCoreLink-sc-16kq0mq-0 jSrrlW tw-link
// twitch tags        | class[] = InjectLayout-sc-1i43xsx-0 eUxEWt
// twitch pfp (src)   | class   = InjectLayout-sc-1i43xsx-0 bEwPpb tw-image tw-image-avatar (very last index)
// twitch game        | class   = CoreText-sc-1txzju1-0 hfMGmo
import { JSDOM } from "jsdom";
import axios from "axios";


axios("http://books.toscrape.com/").then(a => {
    const js = new JSDOM(a.data);
    const res = js.window.document.getElementsByClassName("nav nav-list")

    const list = res.item(0)?.children.item(0);
    const gl_children = list?.children

    if (!gl_children) return;
    const genre_list = gl_children.item(1)?.children
    if (!genre_list) return;

    

    for (const child of genre_list) {
        console.log( child.outerHTML )
        console.log( child.querySelector("a")?.href )
    }
})