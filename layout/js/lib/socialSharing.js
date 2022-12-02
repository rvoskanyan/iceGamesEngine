import ClipboardJS from "clipboard";

class SocialSharing {
    #_options = {
        attr: {
            button: 'data-sharing-show',
            title: 'data-sharing-title',
            main: 'data-sharing',
            text: 'data-sharing-text'
        },
        type: {
            social: 'social-{social_name}',
            device: 'device-{device_name}',
            list: 'list'
        },
        time: 2000,
        time_mode: "ms", // support ms
        last_timeout: {
            visible: null,
            opacity: null
        },
        socials: ['Telegram', 'Facebook', 'Twitter', 'pinterest', 'Ok'],
        devices: ['clipboard', 'more'],
        title: document.title,
        text: '',
        isShow: false
    }
    elList = null
    #_events = {
        social: null,
        clipboard: null,
        more: null,
    }

    constructor(selector) {
        let el = document.querySelector(selector)
        if (!el) throw "Element is not found"
        this.el = el
    }

    eventListener(event, callback) {
        let ev = this.#_events[event]
        if (ev===undefined) {
            console.warn("This is event don't support")
            return
        }
        this.#_events[event] = callback
    }

    #_callEvent(event, context, ...args) {
        let a = this.#_events[event]
        if (a && a.call) {
            a.call(context, ...args)
        }
    }

    change_type({social, device}) {
        if (social) this.#_options.type.social = social
        if (device) this.#_options.type.device = device
    }

    remove_social(name) {
        this.#_options.socials = this.#_options.socials.filter(a => a.toLowerCase() !== name.toLowerCase())
    }

    add_social(name) {
        this.#_options.socials.push(name)
    }

    get_attr(name, type) {
        let $t = ''
        if (type) $t = '=' + this.#_options.type[type]
        return `${this.#_options.attr[name]}${$t}`
    }

    get_attr_for_selector(name, type) {
        return `[${this.get_attr(name, type)}]`
    }

    action(mode, action, link, text, title, img) {
        let actions = {
            social: {
                telegram: () => `https://telegram.me/share/url?url=${link}&text=${text}`,
                facebook: () => `https://www.facebook.com/sharer/sharer.php?u=${link}&t=${title}`,
                twitter: () => `https://twitter.com/intent/tweet?text=${text}url=${link}`,
                ok: () => `https://connect.ok.ru/offer?url=${link}&title=${title}&description=${text}&imageUrl=${img}`,
                pinterest: () => `https://www.pinterest.com/pin/create/link/?url=${link}`
            },
            device: {
                clipboard: () => ClipboardJS.copy(link),
                more: () => {
                    let data = {
                        title, url: link, text
                    }
                    let share = navigator.canShare
                    if (!share || !navigator.canShare(data)) {
                        throw "Not supported"
                    }
                    return navigator.share(data)
                },
            }
        }
        let $act = actions[mode]
        if (!$act) throw 'This mode ' + mode + ' isn\'t support'
        $act = $act[action]
        if (!$act) throw 'This action ' + action + ' not found'
        let answer = $act()
        if (mode === 'social') {
            this.#_callEvent(mode, {mode, action, result:answer}, answer)
        } else if (mode === 'device') {
            this.#_callEvent(action, {mode, action, result:answer}, answer)
        }
    }

    social_init(socials) {
        let context = this
        for (let social of socials) {
            social.addEventListener("click", function (e) {
                let mode = this.getAttribute(context.get_attr('main'))
                if (!mode) throw 'Not found attr: ' + context.get_attr('main')
                let [m, action] = mode.split('-')
                let link = document.location.href
                context.action.call(context, m, action, link, context.#_options.text, context.#_options.title, '')
            })
        }
        return true
    }

    toggleList() {
        let $is = !this.#_options.isShow
        this.#_options.isShow = $is
        let list = this.elList || this.el.querySelector(this.get_attr_for_selector('main', 'list'))
        if ($is) {
            list.style.display = 'block'
            setTimeout(() => {
                list.style.opacity = '1'
                list.style.height = `${list.scrollHeight}px`
            }, 10)
        } else {
            list.style.height = '0'
            if (this.#_options.last_timeout.visible) clearTimeout(this.#_options.last_timeout.visible)
            if (this.#_options.last_timeout.opacity) clearTimeout(this.#_options.last_timeout.opacity)
            this.#_options.last_timeout.opacity = setTimeout(() => list.style.opacity = '0', this.#_options.time / 5)
            this.#_options.last_timeout.visible = setTimeout(() => list.style.display = 'none', this.#_options.time)
        }
    }

    button_init(button) {
        let context = this
        button.addEventListener('click', function () {
            let title = this.getAttribute(context.get_attr("title"))
            let text = this.getAttribute(context.get_attr("text"))
            if (title) context.#_options.title = title
            if (text) context.#_options.text = text
            context.toggleList.call(context)
            button.focus()
        })
        button.addEventListener('blur', function () {
            context.toggleList.call(context)
        })
        return true
    }

    init() {
        let main = this.el
        let list = main.querySelector(this.get_attr_for_selector("main", 'list'))
        if (!list) throw "Element list is not found"
        this.elList = list
        list.style.transaction = `${this.#_options.time}${this.#_options.time_mode} easy-in`
        let socials = list.querySelectorAll(this.get_attr_for_selector('main'))
        if (socials.length <= 0) console.warn("Socials elements is empty")
        let button = main.querySelector(this.get_attr_for_selector("button"))
        if (!button) throw "Element button is not found"
        new Promise(resolve => {
            resolve(this.button_init(button))
        })
        new Promise(resolve => {
            resolve(this.social_init(socials))
        })
    }
}


window.SocialSharing = SocialSharing
export default SocialSharing
