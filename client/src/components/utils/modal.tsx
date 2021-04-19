import React, { FunctionComponent, ReactNode, memo } from "react";

import { Size } from "../../types"

import "./modal.scss"

interface IProps {
    title?: string,
    isOpen: boolean,
    close: Function,
    size?: Size,
    children: ReactNode
}

const Modal: FunctionComponent<IProps> = ({ title, isOpen, close, size = Size.SMALL, children }) => {
    const handleClose = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        if ((event.target as HTMLTextAreaElement).className === "my-modal") close();
    };
    const widthHeight = size === Size.SMALL ? "50%" : "80%";

    return (
        <div className="my-modal" style={{ display: isOpen ? "flex" : "none" }} onMouseDown={handleClose}>
            <div className="my-modal-container" style={{ maxWidth: widthHeight, maxHeight: widthHeight }}>
                {title !== undefined && <div className="my-modal-title">{title}</div>}
                <div className="my-modal-content">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default memo(Modal);