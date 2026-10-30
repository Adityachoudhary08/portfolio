"use client";

import gsap, { ScrollTrigger, SplitText, useGSAP } from "@/libs/gsap";
import { forwardRef, useRef } from "react";
import { useImperativeHandle } from "react";

const TextReveal = forwardRef(({
    children,
    className = "",
    trigger = 'mount',
    scrollStart = 'top 80%',
    splitBy = 'lines',
    duration = 0.67,
    stagger = 0.085,
    delay = 0,
    ease = 'power3.out',
}, ref) => {
    const wrapperRef = useRef(null);
    const splitref = useRef(null);
    const tlref = useRef(null);

    useImperativeHandle(ref, () => ({
        play: () => tlref.current?.play(),
        pause: () => tlref.current?.pause(),
        restart: () => tlref.current?.restart(),
        reverse: () => tlref.current?.reverse(),
    }))


    useGSAP(() => {
        splitref.current = new SplitText(wrapperRef.current, {
            type: splitBy,
            lineThreshold: 0.3
        });
        const elements = splitref.current[splitBy];

        gsap.set(elements, { yPercent: 110, opacity: 0 });

        tlref.current = gsap.timeline({
             paused:true,
            defaults: {delay,}
        })

        tlref.current.to(elements, {
            yPercent: 0,
            opacity: 1,
            duration,
            stagger:{
                each: stagger,
                from: 'start'
            },
            ease
        })

        if(trigger === 'mount'){
            tlref.current.play();
        }

        if(trigger === 'scroll'){
            ScrollTrigger.create({
                trigger: wrapperRef.current,
                start: scrollStart,
                once: true,
                onEnter: () => tlref.current?.play()
            })
        }

        return () => {
            tlref.current?.kill();
            splitref.current?.revert();
        }

    }, {
        scope: wrapperRef,
        dependencies: [trigger, scrollStart, splitBy, duration, stagger, delay, ease]
    })
    return (
        <div ref={wrapperRef} className={`overflow-hidden ${className}`}>
            {children}
        </div>
    )
})

TextReveal.displayName = "TextReveal";

export default TextReveal