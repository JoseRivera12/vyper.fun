const CLEARLINE = '\033[1A'

class Chat {
    constructor(libp2p, topic) {
        this.libp2p = libp2p
        this.topic = topic

        // Join if libp2p is already on
        if (this.libp2p.isStarted()) this.join()
    }
    
    async start () {
        await this.libp2p.start()
        this.join()
    }

    async stop () {
        await this.libp2p.stop()
        this.leave()
    }

    join () {
        this.libp2p.pubsub.subscribe(this.topic, (message) => {
            const fromMe = this.libp2p.peerInfo.id.toB58String() == message.from;
            const user = message.from.slice(-5, -1);
            console.info(`${fromMe ? CLEARLINE : ''}${user}: ${message.data}`)
        })
    }

    leave () {
        this.libp2p.pubsub.unsubscribe(this.topic)
    }

    send (message) {
        message = message.slice(0, -1)
        this.libp2p.pubsub.publish(this.topic, message).catch((err) => {
            if (err) throw err
        })
    }
}

module.exports = Chat
module.exports.TOPIC = '/libp2p/example/chat/1.0.0'

