import React, { FunctionComponent, createRef, useState, memo } from "react";

import { IUser } from "../../types"
import CancelIcon from '@material-ui/icons/Cancel';

import "./tags.scss"

interface IProps {
    tags: string[],
    setTags: Function,
    getOptions?: Function
}

const Tags: FunctionComponent<IProps> = ({ tags, setTags, getOptions }) => {
    const [tag, setTag] = useState("");
    const [display, setDisplay] = useState("none");
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const textInput = createRef<HTMLInputElement>();

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        setTag(value);
        if (getOptions) {
            const options = await getOptions(value);

            setFilteredOptions(options.data.filter((option: IUser) => !tags.includes(option.alias)).map((option: IUser) => option.alias));
        }
    };

    const handleCancel = (idx: number) => {
        if (getOptions)
            setFilteredOptions([...filteredOptions, tags[idx]]);
        setTags(tags.reduce((acc: string[], tag: string, i: number) => idx === i ? acc : [...acc, tag], []));
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const ref = textInput.current

        if (getOptions === undefined && event.key === "Enter" && ref !== null && ref.value !== "") {
            setTags([...tags, tag]);
            setTag("");
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const ref = textInput.current

        if ((event.target as HTMLTextAreaElement).className === "tags")
            if (ref !== null)
                ref.focus();
    }

    const handleFocus = () => {
        setDisplay("block");
    }

    const handleBlur = () => {
        setDisplay("none");
    }

    const selectOption = async (idx: number) => {
        if (getOptions) {
            setTags([...tags, filteredOptions[idx]]);
            setTag("");
            setFilteredOptions([]);
        }
    }

    return (
        <div className="tags-container">
            <ul className="tags" onClick={handleClick}>
                {tags.map((tag: string, idx: number) =>
                    <li className="tags__tag" key={idx}>
                        <span>{tag}</span><CancelIcon fontSize="small" onClick={() => handleCancel(idx)} style={{ cursor: "pointer" }} />
                    </li>
                )}
                <li className="tags__input-container">
                    <input className="tags__input" style={{ width: tag.length + "ch" }} value={tag} ref={textInput} onChange={handleChange} onKeyPress={handleKeyPress} onFocus={handleFocus} onBlur={handleBlur} />
                </li>
            </ul>
            {getOptions && <ul className="tags__options" style={{ display }}>
                {filteredOptions.map((option: string, idx: number) => <li className="tags__options__option" key={idx} onMouseDown={() => selectOption(idx)}>{option}</li>)}
            </ul>}
        </div>
    )
}

export default memo(Tags);