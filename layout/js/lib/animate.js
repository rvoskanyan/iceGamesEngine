export default function (duration, call) {
    if (!duration || typeof duration!=='number') throw "Duration set incorrect"
    if (!call || !call.call) throw "Argument \"call\" for function is not function"
    let sec = 1000
    let call_ms = sec / 60
    let time_out = 0
    let count_animate = Math.ceil(duration / call_ms)
    let interval_id = setInterval(function (e) {
        time_out += call_ms
        let data_ths = {
            sec, call_ms, time_out, duration, is_finish:false, count_animate
        }
        let finish = call.call(data_ths)

        if (finish) {
            // Finish from function
            clearInterval(interval_id)
        } else if (time_out>=duration) {
            // Finish
            data_ths.is_finish=true
            call.call(data_ths)
            clearInterval(interval_id)
        }
    }, call_ms)
}
