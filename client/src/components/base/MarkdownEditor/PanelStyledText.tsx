import { BoldOutlined, FontSizeOutlined, FormOutlined, ItalicOutlined, LinkOutlined, OrderedListOutlined, PictureFilled, PictureOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import React, { Fragment } from 'react';

const PanelStyledText: React.FC<any> = (props) => {
    const ruleBoldStyle = `**[text]**`;
    const ruleItalicStyle = `*[text]*`;
    const ruleHeadingStyle = [
        `# [text]`,
        `## [text]`,
        `### [text]`,
        `#### [text]`,
        `##### [text]`,
        `###### [text]`,
    ]
    const ruleListStyle = `- [item_list]\n`;
    const ruleLinkStyle = `[Текст ссылки](link)`;
    const ruleImageStyle = `![Альтернативный текст](src)`;
    const ruleBlockquoteStyle = `> [blockquote]`;


    const { selectedText } = props;
    const { toMarkdown } = props;

    const handleBoldStyle = () => {
        if (selectedText?.value.length) {
            toMarkdown(ruleBoldStyle.replace(/\[text\]/ig, selectedText?.value));
            return;
        }
        toMarkdown(ruleBoldStyle.replace(/\[text\]/ig, 'Полужирный текст'));
    }
    const handleBlockquoteStyle = () => {
        if (selectedText?.value.length) {
            toMarkdown(ruleBlockquoteStyle.replace(/\[text\]/ig, selectedText?.value));
            return;
        }
        toMarkdown(ruleBlockquoteStyle.replace(/\[text\]/ig, 'Начало цитаты...(отредактируйте)'));
    }
    const handleItalicStyle = () => {
        if (selectedText?.value.length) {
            toMarkdown(ruleItalicStyle.replace(/\[text\]/ig, selectedText?.value));
            return;
        }
        toMarkdown(ruleItalicStyle.replace(/\[text\]/ig, 'Курсивный текст'));
    }
    const handleChooseLevelHeading = (level: number) => {
        if (selectedText?.value.length) {
            toMarkdown(ruleHeadingStyle[level - 1].replace(/\[text\]/ig, selectedText?.value));
            return;
        }
        toMarkdown(ruleHeadingStyle[level - 1].replace(/\[text\]/ig, ''));
    }
    const handleLinkStyle = () => {
        if (selectedText?.value.length) {
            toMarkdown(ruleLinkStyle.replace(/Текст ссылки/g, selectedText?.value));
            return;
        }
        toMarkdown(ruleLinkStyle.replace(/link/ig, ''));
    }
    const handleImageStyle = () => {
        if (selectedText?.value.length) {
            toMarkdown(ruleImageStyle.replace(/src/g, selectedText?.value));
            return;
        }
        toMarkdown(ruleImageStyle.replace(/src/ig, 'https://Вставьте_ссылку_на_изображение'));
    }
    const handleListStyle = () => {
        const value = selectedText?.value;
        if (value?.length) {
            const items = value.split('\n');
            let markdownListRes = [];
            items.forEach((item) => {
                markdownListRes.push(ruleListStyle.replace(/\[item_list\]/ig, item));
            })
            toMarkdown(markdownListRes.join(''))
            return;
        }
        toMarkdown(ruleListStyle.replace(/\[item_list\]/ig, 'Элемент списка'))
    }

    const menuHeading = (
        <Menu>
            {[1, 2, 3, 4, 5, 6].map(level => (
                <Menu.Item key={level} onClick={() => handleChooseLevelHeading(level)}>Heading {level}</Menu.Item>
            ))}
        </Menu>
    )

    return (
        <Fragment>
            <Button icon={<BoldOutlined />} onClick={handleBoldStyle}></Button>
            <Button icon={<ItalicOutlined />} onClick={handleItalicStyle}></Button>
            <Button icon={<OrderedListOutlined />} onClick={handleListStyle}></Button>
            <Button icon={<LinkOutlined />} onClick={handleLinkStyle}></Button>
            <Button icon={<PictureOutlined />} onClick={handleImageStyle}></Button>
            <Button icon={<FormOutlined />} onClick={handleBlockquoteStyle}></Button>
            <Dropdown.Button overlay={menuHeading} icon={<FontSizeOutlined />}></Dropdown.Button>
        </Fragment>
    )
}

export default PanelStyledText;