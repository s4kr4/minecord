import Replacers from '../Replacers'
import dictionary from './dictionary'

const replacers = (new Replacers)
  .add(/^<(.*?)>\s(.*)$/, (message, player, text) => `**${player}**: ${text}`)
  .add(/^\[(.*?)]\s(.*)$/, (message, player, text) => `**${player}**: ${text}`)

const generateMessage = (message) => {

  if (message.attachments.size > 0) {
    return {
      text: `[Discord] ${message.member && message.member.nickname || message.author.username} が画像を送信しました`,
      italic: true,
      color: "aqua",
    }
  }

  return {
    text: `<${message.member && message.member.nickname || message.author.username}> ${message.cleanContent}`
  }
}

const translateLogs = (message) => {
  let translated = ''
  dictionary.map((sentense) => {
    const matched = message.match(sentense.regex)
    if (matched) {
      if (matched.length === 2) {
        translated = sentense.japanese.replace('player', matched[1])
      } else if (matched.length === 3) {
        translated = sentense.japanese
          .replace('player', matched[1])
          .replace('mob', matched[2])
      }
    }
  })

  return translated
}

export default Plugin => new Plugin({
  async discord ({message, sendToMinecraft}) {
    if (/^!sh/.test(message.cleanContent)) return

    await sendToMinecraft(`tellraw @a ${JSON.stringify(generateMessage(message))}`)
  },
  async minecraft ({causedAt, level, message, sendToDiscord}) {
    if (/^Async\sChat\sThread/.test(causedAt)) {
      const newMessage = replacers.replace(message)
      if (newMessage !== false) await sendToDiscord(newMessage.replace('\u001b[m', ''))
    } else if (/^Server\sthread/.test(causedAt)) {
      const translated = translateLogs(message)
      if (translated) await sendToDiscord(`**${translated}**`)
    }
  }
})
