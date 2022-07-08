import React, {FunctionComponent, useRef, useState} from "react";
import {Button, message, Modal, Tree} from 'antd';
import {DataNode} from "antd/lib/tree";
import {DocsApi} from "../api/DocsApi";

const {DirectoryTree} = Tree;


interface Props {
    domains: Map<String, Array<String>>,
    onUpdateDocs: () => void
}

export const FolderTree: FunctionComponent<Props> = ({domains, onUpdateDocs}) => {
    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const selectedDomain = useRef<String | null>(null);
    const selectedDocName = useRef<String | null>(null);
    let docsApi = new DocsApi();
    // @ts-ignore
    const onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
        if (selectedKeys[0].toString().indexOf("/") != -1) {
            let arr = selectedKeys[0].toString().split("/");
            let domain = arr[0];
            let doc = arr[1];
            selectedDomain.current = domain;
            selectedDocName.current = doc;
            setModalVisible(true);
        }
    }

    const handleCancel = () => {
        setModalVisible(false);
    }

    const handleDelete = () => {
        if (selectedDomain.current && selectedDocName.current) {
            docsApi.deleteDoc(selectedDomain.current, selectedDocName.current).then(() => {
                message.success("Удалено");
                onUpdateDocs();
                setModalVisible(false);
            }).catch((e) => {
                message.error(e);
            });

        }

    }
    const handleOpen = () => {
        if (selectedDomain.current && selectedDocName.current) {
            let a = document.createElement("a");
            a.href = "/watch/" + selectedDomain.current + "/" + selectedDocName.current + "?page=" + 0 + "&words=[]";
            a.target = "_blank";
            a.click();
        }
    }
    let treeData: DataNode[] = []
    for (let key of Object.keys(domains)) {
        // @ts-ignore
        let domainDocs = domains[key];
        if (!domainDocs)
            continue;
        let domainDocNodes: DataNode[] = []
        for (let j = 0; j < domainDocs.length; j++) {
            let document = domainDocs[j];
            let docNode = {title: document, key: key + "/" + document, isLeaf: true} as DataNode;
            domainDocNodes.push(docNode);
        }
        let domainNode = {title: key, key: key, children: domainDocNodes} as DataNode;
        treeData.push(domainNode);
    }

    console.log(treeData)
    return (<>
        <DirectoryTree
            defaultExpandAll
            onSelect={onSelect}
            treeData={treeData}
        />
        <Modal title="Действия с документом"
               onCancel={handleCancel}
               visible={isModalVisible}
               footer={[
                   <Button type="primary" danger key="delete" onClick={handleDelete}>
                       Удалить
                   </Button>,
                   <Button key="open" type="primary" onClick={handleOpen}>
                       Открыть
                   </Button>,
               ]}
               okText="Загрузить"
               cancelText="Отмена">
            <p>Что сделайть с докуметом ?</p>
        </Modal>
    </>);
}