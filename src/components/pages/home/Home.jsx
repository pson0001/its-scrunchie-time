import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Draggable } from 'gsap/draggable'
import c from './Home.module.scss'
import A1Black from '../../../assets/img/A1-black.png'
import A1Red from '../../../assets/img/A1-red.png'
import A1Blue from '../../../assets/img/A1-blue.png'
import A1Orange from '../../../assets/img/A1-orange.png'
import A1Pink from '../../../assets/img/A1-pink.png'
import A2Black from '../../../assets/img/A2-black.png'
import A2Red from '../../../assets/img/A2-red.png'
import A2Blue from '../../../assets/img/A2-blue.png'
import A2Yellow from '../../../assets/img/A2-yellow.png'
import Placeholder from '../../../assets/img/placeholder.png'
import LogoBig from '../../../assets/img/logo-big.svg'
import { IconX } from '../../../assets/Icon'
gsap.registerPlugin(Draggable)

const Home = () => {
    const containerRef = useRef(null)
    const contentRef = useRef(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const draggableRef = useRef(null)

    const A1 = [
        A1Black,
        A1Red,
        A1Pink,
        A1Blue,
        A1Orange,
    ]

    const A2 = [
        A2Black,
        A2Red,
        A2Blue,
        A2Yellow, Placeholder
    ]

    useEffect(() => {
        const container = containerRef.current
        const content = contentRef.current

        if (!container || !content) return

        let draggable = null

        // Wait for content to render and calculate dimensions
        const initDraggable = () => {
            // Use viewport dimensions directly
            const vw = window.innerWidth
            const vh = window.innerHeight

            // Container is 100vw x 100vh, content is 200vw x 200vh
            // To center viewport on content: offset by half the difference
            const centerX = -vw / 2  // -50vw
            const centerY = -vh / 2  // -50vh

            // Bounds: can drag from center to edges
            // minX: -100vw (showing rightmost part), maxX: 0 (showing leftmost part)
            const minX = -vw  // -100vw
            const maxX = 0
            const minY = -vh  // -100vh
            const maxY = 0

            // Check if content is already positioned (preserve position if dragging)
            const currentX = gsap.getProperty(content, 'x')
            const currentY = gsap.getProperty(content, 'y')

            // Only set to center if not already positioned (first load)
            if (currentX === 0 && currentY === 0) {
                gsap.set(content, { x: centerX, y: centerY })
            }

            draggable = Draggable.create(content, {
                type: 'x,y',
                bounds: {
                    minX,
                    maxX,
                    minY,
                    maxY,
                },
                edgeResistance: 0.85,
                cursor: 'grab',
                activeCursor: 'grabbing',
                inertia: true,
                throwProps: true,
            })[0]

            draggableRef.current = draggable
        }

        // Use setTimeout to ensure dimensions are calculated after render
        const timeoutId = setTimeout(initDraggable, 100)

        return () => {
            clearTimeout(timeoutId)
            if (draggable) {
                draggable.kill()
            }
        }
    }, [])

    // Disable/enable dragging when modal opens/closes
    useEffect(() => {
        if (draggableRef.current) {
            if (selectedImage) {
                draggableRef.current.disable()
            } else {
                draggableRef.current.enable()
            }
        }
    }, [selectedImage])

    // Close modal on ESC key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && selectedImage) {
                setSelectedImage(null)
            }
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [selectedImage])

    const handleImageClick = (imageSrc) => {
        // Prevent clicking on placeholder
        if (imageSrc === Placeholder) {
            return
        }
        setSelectedImage(imageSrc)
    }

    const handleCloseModal = (e) => {
        // Close if clicking on backdrop (not the image itself)
        if (e.target === e.currentTarget) {
            setSelectedImage(null)
        }
    }

    return (
        <>
            <div ref={containerRef} className={c.container}>
                <div ref={contentRef} className={c.home}>
                    <div className={c.scrunchies}>
                        {A1.map((scrunchie, index) => (
                            <img
                                key={index}
                                src={scrunchie}
                                alt={`scrunchie-${index + 1}`}
                                onClick={() => handleImageClick(scrunchie)}
                                className={c.scrunchieImage}
                            />
                        ))}
                    </div>
                    <img src={LogoBig} alt="Logo" className={c.logoBig} />
                    <div className={c.scrunchies}>
                        {A2.map((scrunchie, index) => (
                            <img
                                key={index}
                                src={scrunchie}
                                alt={`scrunchie-${index + 1}`}
                                onClick={() => handleImageClick(scrunchie)}
                                className={`${c.scrunchieImage} ${scrunchie === Placeholder ? c.disabled : ''}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {selectedImage && (
                <div className={c.modal} onClick={handleCloseModal}>
                    <div className={c.modalContent}>
                        <button
                            className={c.closeButton}
                            onClick={() => setSelectedImage(null)}
                            aria-label="Close modal"
                        >
                            <IconX />
                        </button>
                        <div className={c.modalImageContainer} >
                            <img
                                src={selectedImage}
                                alt="Selected scrunchie"
                                className={c.modalImage}
                            />
                        </div>
                        <div className={c.modalDescription}>
                            Here is the description of the scrunchie
                        </div>
                    </div>

                </div>
            )}
        </>
    )
}

export default Home