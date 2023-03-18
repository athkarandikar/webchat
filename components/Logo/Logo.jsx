import Image from 'next/image'

function Logo(props) {
    return (
        <div className={props.className}>
            <Image
                src={
                    props.type === 'full'
                        ? '/logos/logo-full.svg'
                        : '/logos/logo-compact.svg'
                }
                alt='Webchat logo'
                layout='fill'
                objectFit='fill'
                priority='true'
            />
        </div>
    )
}

export default Logo
