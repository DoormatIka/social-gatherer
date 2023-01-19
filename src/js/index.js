var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { YouTubeChannel } from "./lib/yt.js";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const penguinz0 = new YouTubeChannel("penguinz0", 3000);
        yield penguinz0.validate();
        // listen to the upload of the penguinz0 channel
        const listen = yield penguinz0.getVideoListener(false);
        listen.on("newUpload", n => console.log(n));
    });
}
main().then(() => { });
