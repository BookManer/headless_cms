import { Col, Row } from 'antd';
import React, { Fragment, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ToastsStore } from 'react-toasts';
import PanelStyledText from './PanelStyledText';

const BaseMarkdownEditor: React.FC<any> = (props) => {
    const [markdownText, setMarkdownText] = useState<string>('');
    const [selectedText, setSelectText] = useState<{ value: string, start: number, end: number }>();
    const htmlPreviewer = useRef();

    const handleSelection = ({ currentTarget }) => {
        let { selectionStart, selectionEnd, value } = currentTarget;
        ToastsStore.info(`Start: ${selectionStart}\nEnd: ${selectionEnd}`)
        value = value.substring(selectionStart, selectionEnd);
        setSelectText({ value, start: selectionStart === undefined ? selectionEnd : selectionStart, end: selectionEnd });
    }
    const toMarkdownText = (text: string) => {
        let { start, end } = selectedText;
        const lengthFullValue = markdownText.substring(0, start).length + markdownText.substring(end, markdownText.length).length + text.length;
        const fullValueTextarea = `${markdownText.substring(0, start)}${text}${markdownText.substring(end, lengthFullValue)}`
        setMarkdownText(fullValueTextarea);
        const el: HTMLElement = htmlPreviewer.current;
        console.dir(el.innerHTML);
    }

    return (
        <Fragment>
            <Row>
                <Col>
                    <PanelStyledText toMarkdown={toMarkdownText} selectedText={selectedText}></PanelStyledText>
                </Col>
            </Row>
            <Row>
                <Col span={'auto'}>
                    <textarea cols={100} rows={20} onSelect={handleSelection} value={markdownText} onInput={({ currentTarget }) => setMarkdownText(currentTarget.value)}>
                    </textarea>
                </Col>
                <Col span={'auto'} ref={htmlPreviewer}>
                    {/* <div dangerouslySetInnerHTML={{ __html: markdownText }}></div> */}
                    {/* {window.getSelection().focusNode.date} */}
                    <ReactMarkdown>{markdownText}</ReactMarkdown>
                </Col>
            </Row>
            <Row>
            </Row>
        </Fragment>
    )
}

export default BaseMarkdownEditor;