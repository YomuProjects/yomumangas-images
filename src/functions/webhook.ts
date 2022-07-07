import { MessageActionRow, MessageButton, MessageEmbed, WebhookClient } from "discord.js";

const webhook = new WebhookClient({ id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN, url: process.env.WEBHOOK_URL });

export function create(url: string, name: string, size: number, width: number, height: number, username: string, avatarURL: string, content: string) {
    webhook.send({ content: `<:UIINFO:952279296582488105> **\`${content}\`**`, username, avatarURL, embeds: [new MessageEmbed().setColor("GREEN").setImage(url).setDescription(`<:UIALIGNC:952279589567234078> **Imagem:** [${name}](${url})\n<:UISTATS:952279339104366722> **Tamanho:** \`${size}\`\n<:UIANGLEUP:952279101786443786> **Altura:** \`${height}\`\n<:UIANGLERIGHT:952279200558100530> **Largura:** \`${width}\``)], components: [new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setLabel("Abrir Imagem").setEmoji("952279689886568518").setURL(url))] })
}

export async function remove(url: string, name: string, username: string, avatarURL: string, content: string) {
    await webhook.send({ content: `<:UIINFO:952279296582488105> **\`${content}\`**`, username, avatarURL, embeds: [new MessageEmbed().setColor("RED").setDescription(`<:UIALIGNC:952279589567234078> **Imagem:** \`${name}\``)], files: [url] });
}