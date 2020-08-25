// @ts-nocheck
import React,{useEffect, useState} from 'react'; 
import { Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

class MetaTags extends React.Component {
  state = {
    tags: [],
    inputVisible: false,
    inputValue: '',
    editInputIndex: -1,
    editInputValue: '',
  };



  handleClose = removedTag => {
    const {setTags,tags} = this.props;
    const localTags = tags.filter(tag => tag !== removedTag);
    setTags(localTags);
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
      console.log('handleInputConfirm',this.props);
    const { inputValue } = this.state;
    let { tags, setTags } = this.props;
    if (inputValue && tags && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    setTags(tags);
    this.setState({
      inputVisible: false,
      inputValue: '',
    });
  };

  handleEditInputChange = e => {
    this.setState({ editInputValue: e.target.value });
    console.log('tagValue',e.target.value);
  };

  handleEditInputConfirm = () => {
    this.setState(({ editInputIndex, editInputValue }) => {
      return {
        editInputIndex: -1,
        editInputValue: '',
      };
    });

    const newTags = [...this.props.tags];
    newTags[editInputIndex] = editInputValue;
    this.props.setTags(newTags);
  };

  saveInputRef = input => {
    this.input = input;
  };

  saveEditInputRef = input => {
    this.editInput = input;
  };



  render() {
    const { inputVisible, inputValue, editInputIndex, editInputValue } = this.state;
    const { placeholder,tags } = this.props;

    return (
      <>
        {tags && tags.length > 0 && tags.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={this.saveEditInputRef}
                key={tag}
                size="small"
                placeholder={placeholder}
                className="tag-input"
                value={editInputValue}
                onChange={this.handleEditInputChange}
                onBlur={this.handleEditInputConfirm}
                onPressEnter={this.handleEditInputConfirm}
              />
            );
          }

          const isLongTag = tag.length > 20;

          const tagElem = (
            <Tag
              className="edit-tag"
              key={tag}
              closable={true}
              onClose={() => this.handleClose(tag)}
            >
              <span
                onDoubleClick={e => {
                  if (index !== 0) {
                    this.setState({ editInputIndex: index, editInputValue: tag }, () => {
                      this.editInput.focus();
                    });
                    e.preventDefault();
                  }
                }}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
          style={{
            margin: "10px 0"
          }}
            ref={this.saveInputRef}
            type="text"
            size="small"
            className="tag-input"
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag className="site-tag-plus edit-tag" onClick={this.showInput}>
            <PlusOutlined /> New Value
          </Tag>
        )}
      </>
    );
  }
}

export default MetaTags