import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { Config } from "../config";

export async function getData(text: string, speaker: string) {
    const data = await fetch(Config.apis.tts, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text,
            speaker
        })
    })
        .then(async (res) => await res.json())
        .catch(() => null);

    if (!data) return null;

    const fileName = randomCode(10);
    const name = join(process.cwd(), "cache", fileName + ".mp3");

    await writeFile(name, Buffer.from(data.v_str, "base64"));
    return name;
}

function randomCode(length: number): string {
    let result = "";

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}