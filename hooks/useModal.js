import {useState} from 'react'

function useModal(openModalHandler, closeModalHandler) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    function openModal() {
        setIsModalOpen(true)
        if (openModalHandler) openModalHandler()
    }

    function closeModal() {
        setIsModalOpen(false)
        if (closeModalHandler) closeModalHandler()
    }

    function justCloseModal() {
        setIsModalOpen(false)
    }

    return {
        isModalOpen,
        openModal,
        closeModal,
        justCloseModal
    }
}

export default useModal
