import { inject, observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { SearchFolders } from './SearchFolders/SearchFolders';
import { TreeListFolders } from './TreeListFolders/TreeListFolders';

@inject('fileSystemStore')
@observer
export class SidebarFolders extends React.PureComponent<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            folders: props.fileSystemStore.folders,
            searchedFolders: []
        }
        this.handleAddFolder = this.handleAddFolder.bind(this);
        this.handleSearchFolder = this.handleSearchFolder.bind(this);
    }

    componentDidMount() {
        this.setState({folders: this.props.fileSystemStore?.folders});
    }

    handleAddFolder(folder: any) {
        const folders = this.state.folders;
        this.setState({ folders: [...folders, folder] });
    }

    handleSearchFolder(searchedFolders: any[]) {
        this.setState({ searchedFolders: searchedFolders });
    }

    render() {
        const folders = this.props.fileSystemStore.folders;
        return (
            <Fragment>
                <SearchFolders onSearch={this.handleSearchFolder} folders={folders}></SearchFolders>
                { folders?.length && <TreeListFolders folders={this.state.searchedFolders?.length ? this.state.searchedFolders : folders} addFolder={this.handleAddFolder}></TreeListFolders> }
            </Fragment>
        )
    }
}