import Replacers from '../Replacers'

const replacers = (new Replacers)
  .add(/^(.*)\[.*]\slogged\sin\swith.*$/, (message, player) => `**${player}** がログインしたよ`)
  .add(/^(.*)\sleft\sthe\sgame$/, (message, player) => `**${player}**  がログアウトしたよ`)

export default Plugin => new Plugin({
  async minecraft ({causedAt, level, message, sendToDiscord}) {
    if (causedAt !== 'Server thread' || level !== 'INFO') return

    const newMessage = replacers.replace(message)
    if (newMessage !== false) await sendToDiscord(newMessage)
  }
})
