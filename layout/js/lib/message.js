function changeStatus() {
// Future
}

function changeText() {
// Future
}

const maxMessages = 5;

class Message {
    #_text = ''
    #_elements = {
        parent: null,
        message: null,
        exit: null
    }
    #_option = {
        supportStatus: ['alert', 'success', 'info', 'error'],
        status: 'info',
        duration: 1000,
        duration_mode: 'ms',
        style: {
            alert: {
                color: '#FFFFFF',
                background: 'rgba(252,217,88,0.4)'
            },
            success: {
                color: '#fff',
                background: '#320065'
            },
            info: {
                color: '#fff',
                background: 'rgba(0,190,255,0.4)'
            },
            error: {
                color: '#fff',
                background: 'rgba(218,66,107,0.4)'
            }
        },
        time_close: 5000
    }
    #_events = {
        close: null,
        changeStatus,
        changeText,
        open: null
    }

    constructor(text) {
        this.#_text = text
    }

    setStatus(status) {
        if (!this.#_option.supportStatus.includes(status.toLowerCase())) throw 'Don\'t support status ' + status
        this.#_option.status = status
        this.#_callEvent('changeStatus')
    }

    #_callEvent(event, context, ...args) {
        let a = this.#_events[event]
        if (a && a.call) {
            a.call(context, ...args)
        }
    }

    eventListener(event, callback) {
        let ev = this.#_events[event]
        if (ev === undefined) {
            console.warn("This is event don't support")
            return
        }
        this.#_events[event] = callback
    }

    changeText(text) {
        this.#_text = text
        this.#_callEvent('changeText', this.#_elements.message)
    }

    #_add_parent() {
        let parent = this.#_elements.parent || document.getElementById("section#message-bit-lib")
        if (!!parent) {
            console.warn("Parent message exist")
            return
        }
        let el = document.createElement("section")
        el.setAttribute("id", 'message-bit-lib')
        el.style.position = 'fixed'
        el.style.right = '10px'
        el.style.top = '88px'
        el.style.zIndex = '99999'
        el.style.width = '200px'
        el.style.overflow = 'hidden'
        document.body.append(el)
        this.#_elements.parent = el
        return el
    }

    #_get_child() {
        let child = document.createElement('div')
        child.style.width = '200px'
        child.style.borderRadius = '8px'
        child.style.color = this.#_option.style[this.#_option.status].color
        child.style.background = this.#_option.style[this.#_option.status].background
        child.style.padding = '8px 12px'
        child.style.fontWeight = '500'
        child.style.opacity = '0'
        child.style.marginLeft = '200px'
        child.style.marginBottom = '8px'
        child.style.transform = 'translateY(-60px)'
        child.style.transition = `${this.#_option.duration}${this.#_option.duration_mode} ease-in`
        return child
    }

    #_hidden_child(child) {
        if (!child) return;
        child.style.opacity = '0'
        child.style.marginLeft = '200px'
        child.style.transform = 'translateY(60px)'
        setTimeout(() => {
            child.remove()
        }, this.#_option.duration)
    }

    show(is_close) {
        let parent = this.#_elements.parent || document.getElementById("message-bit-lib")
        if (!parent) parent = this.#_add_parent()
        let child = this.#_get_child()
        parent.prepend(child)
        this.#_elements.message = child
        if (parent.children.length > maxMessages) {
            this.#_hidden_child(parent.lastElementChild)
        }
        setTimeout(() => {
            child.style.opacity = '1'
            child.style.marginLeft = '0'
            child.style.transform = 'translateY(0)'
            child.textContent = this.#_text
        }, 10)
        if (is_close) {
            setTimeout(() => {
                this.#_hidden_child(child)
                this.#_elements.message = null
            }, this.#_option.time_close)
        }
    }
}


export default Message