import React, {FunctionComponent, useState} from "react";
import {Menu, Select, Typography} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined, ProfileOutlined, UserOutlined} from "@ant-design/icons";
import {SearchApi} from "../api/SearchApi";
import UserContext from "../context/UserContext";
import 'antd/dist/antd.css';
import {MenuInfo} from 'rc-menu/lib/interface'
import {DocsMenuItem} from "./menuItems/DocsMenuItem";
import {UsersMenuItem} from "./menuItems/UsersMenuItem";

const {Title, Paragraph, Text, Link} = Typography;
const {Option} = Select;

interface Props {
}

enum MenuItemType {
    COLLAPSE_BUTTON = "COLLAPSE_BUTTON",
    DOCS = "DOCS",
    ACCOUNTS = "ACCOUNTS"
}

export const AdminPanel: FunctionComponent<Props> = ({}) => {
    const [collapsedMenu, setCollapsedMenu] = useState<boolean>(true);
    const [selectedItem, setSelectedItem] = useState<MenuItemType>(MenuItemType.DOCS);
    const [domains, setDomains] = useState<Array<JSX.Element>>(new Array<JSX.Element>());
    const {userInfo} = React.useContext(UserContext);
    const searchApi = new SearchApi(userInfo?.token ? userInfo?.token : "");
    React.useEffect(() => {
        searchApi.getDomains().then(values => {
                let elemsArr = new Array<JSX.Element>()
                for (let domain of values) {
                    // @ts-ignore
                    elemsArr.push(<Option key={domain}>{domain}</Option>)
                }
                setDomains(elemsArr);
            }
        )
    }, [])
    const OnMenuItemSelected = (item: MenuInfo) => {
        switch (item.key) {
            case MenuItemType.COLLAPSE_BUTTON:
                toggleCollapsed();
                break;
            case MenuItemType.DOCS:
            case MenuItemType.ACCOUNTS:
                setSelectedItem(item.key);
                break;
        }
    }

    // @ts-ignore
    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }

    const toggleCollapsed = () => {
        setCollapsedMenu(!collapsedMenu)
    }
    let collapseItem = collapsedMenu ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>
    // @ts-ignore
    return (<>
        <div className={"Header"}>
            <Typography style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                padding: 10
            }}>
                <Title style={{color: "#f2eee9", margin: 0}}>Панель администратора</Title>
            </Typography>
        </div>
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            margin: 10
        }}>
            <div>
                <Menu
                    onClick={OnMenuItemSelected}
                    defaultSelectedKeys={[selectedItem]}
                    mode="inline"
                    inlineCollapsed={collapsedMenu}
                    items={[
                        getItem('Свернуть', MenuItemType.COLLAPSE_BUTTON, collapseItem, null, null),
                        getItem('Документы', MenuItemType.DOCS, <ProfileOutlined/>, null, null),
                        getItem('Аккаунты', MenuItemType.ACCOUNTS, <UserOutlined/>, null, null)
                    ]}
                />
            </div>
            <div style={{backgroundColor: "red", flexGrow: 1, height: "50vh"}}>
                {selectedItem == MenuItemType.DOCS && <DocsMenuItem/>}
                {selectedItem == MenuItemType.ACCOUNTS && <UsersMenuItem/>}
            </div>
        </div>
    </>);
}