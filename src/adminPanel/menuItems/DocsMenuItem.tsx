import {FunctionComponent, useRef, useState} from "react";
import {Button, message, Modal, Select} from "antd";
import {DocsApi} from "../../api/DocsApi";
import {UploadOutlined} from "@ant-design/icons";

interface Props {
    domains: Array<JSX.Element>
}

export const DocsMenuItem: FunctionComponent<Props> = ({domains}) => {
    const [isNewFileModalVisible, setNewFileModalVisible] = useState<boolean>(false);
    // @ts-ignore
    const [selectedDomain, setSelectedDomain] = useState<String>(domains[0].key);
    const [uploadedFileName, setUploadedFileName] = useState<String | null>(null);
    const uploadNewFile = useRef<HTMLInputElement | null>(null);
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
    const handleCancel = () => {
        setNewFileModalVisible(false);
    }
    console.log(domains.length);
    return (<>
        {domains.length > 0 && <>
            <Button onClick={() => {
                setNewFileModalVisible(true)
            }}>Загрузить</Button>
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