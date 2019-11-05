import Replacers from '../Replacers'

const replacers = (new Replacers)
  .add(/^<(.*?)>\s(.*)$/, (message, player, text) => `**${player}**: ${text}`)
  .add(/^\[(.*?)]\s(.*)$/, (message, player, text) => `**${player}**: ${text}`)

const generateMessage = (message) => {

  if (message.attachments.size > 0) {
    return {
      text: `[Discord] ${message.member && message.member.nickname || message.author.username}> が画像を送信しました`,
      italic: true,
      color: "aqua",
    }
  }

  return {
    text: `<${message.member && message.member.nickname || message.author.username}> ${message.cleanContent}`
  }
}

export default Plugin => new Plugin({
  async discord ({message, sendToMinecraft}) {
    if (/^!sh/.test(message.cleanContent)) return

    await sendToMinecraft(`tellraw @a ${JSON.stringify(generateMessage(message))}`)
  },
  async minecraft ({causedAt, level, message, sendToDiscord}) {
    if (!/^Async\sChat\sThread/.test(causedAt)) return

    const newMessage = replacers.replace(message)
    if (newMessage !== false) await sendToDiscord(newMessage.replace('\u001b[m', ''))
  }
})
