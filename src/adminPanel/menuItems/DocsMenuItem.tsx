import React, {FunctionComponent, useRef, useState} from "react";
import {Button, message, Modal, Select} from "antd";
import {DocsApi} from "../../api/DocsApi";
import {UploadOutlined} from "@ant-design/icons";
import {FolderTree} from "../../folderTree/FolderTree";

const {Option} = Select;

interface Props {

}

export const DocsMenuItem: FunctionComponent<Props> = ({}) => {
    const [isNewFileModalVisible, setNewFileModalVisible] = useState<boolean>(false);
    // @ts-ignore
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [domains, setDomains] = useState<Array<JSX.Element>>(new Array<JSX.Element>());
    const [selectedDomain, setSelectedDomain] = useState<String>("");
    const [uploadedFileName, setUploadedFileName] = useState<String | null>(null);
    const uploadNewFile = useRef<HTMLInputElement | null>(null);
    const [docsTree, setDocsTree] = useState<Map<String, Array<String>>>(new Map());
    let docsApi = new DocsApi();
    const handleOk = () => {
        if (!uploadNewFile.current || !uploadNewFile.current.files)
            return;

        let formData = new FormData();
        let file = uploadNewFile.current.files[0];
        console.log(file);
        formData.append('file', file);
        formData.append('tags', '[]');
        console.log(selectedDomain)
        if (!selectedDomain)
            return;
        docsApi.uploadFile(selectedDomain, file.name, formData).then(() => {
            message.success('Загружено!')
        }).catch(() => {
            message.error("Что-то пошло не так");
        });
    }
    const fetchDomains = () => {
        docsApi.getDocsTree().then(map => {
                let domains = Object.keys(map);
                console.log(domains, map)
                let elemsArr = new Array<JSX.Element>()
                for (let domain of domains) {
                    // @ts-ignore
                    elemsArr.push(<Option key={domain}>{domain}</Option>)
                }
                setDomains(elemsArr);
                setDocsTree(map);
                setIsLoad(true);
            }
        )
    }
    const handleCancel = () => {
        setNewFileModalVisible(false);
    }
    React.useEffect(() => {
        fetchDomains();
    }, [])
    return (<>
        {isLoad && <>
            <Button onClick={() => {
                setNewFileModalVisible(true)
            }}>Загрузить</Button>
            <FolderTree domains={docsTree} onUpdateDocs={fetchDomains}/>
            <Modal title="Загрузка файлов"
                   onCancel={handleCancel}
                   visible={isNewFileModalVisible}
                   footer={[
                       <Button key="back" onClick={handleCancel}>
                           Отмена
                       </Button>,
                       <Button key="send" type="primary" disabled={uploadedFileName == null} onClick={handleOk}>
                           Отправить
                       </Button>,
                   ]}
                   okText="Загрузить"
                   cancelText="Отмена">
                <div style={{display: "flex", flexDirection: "column"}}>
                    <p>Домен:</p>
                    <Select
                        defaultValue={selectedDomain}
                        style={{
                            minWidth: 120, marginBottom: 20
                        }}
                        onChange={(v) => {
                            console.log(v);
                            setSelectedDomain(v)
                        }}
                    >
                        {domains}
                    </Select>
                    <input name="docs" type="file" ref={uploadNewFile} style={{display: "none"}}
                           onChange={(v) => {
                               if (v.target && v.target.files)
                                   setUploadedFileName(v.target.files[0].name)
                           }}/>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center"
                    }}>
                        <Button style={{width: 100, marginRight: 20}} onClick={() => {
                            uploadNewFile.current?.click()
                        }}><UploadOutlined/></Button>
                        {uploadedFileName && <p style={{margin: 0}}>{uploadedFileName}</p>}
                    </div>
                </div>
            </Modal>
        </>
        }
    </>)
}