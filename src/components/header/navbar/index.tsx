import { List } from "@mui/material";
import type React from "react";
import CustomListItem from "./customListItems";
import { useNavigate, useLocation } from "react-router-dom";

const NavBar: React.FC = () => {
    const tabs = ["dashboard", "builds", "metrics", "iam", "actions"]
    const navigate = useNavigate()
    const location = useLocation()

    const getCurrentTab = () => {
        if (location.pathname === "/") return "dashboard"
        return location.pathname.replace("/", "")
    }

    const currentTab = getCurrentTab()

    const onClickTab = (tabname: string) => {
        const path = tabname === "dashboard" ? "/" : `/${tabname}`
        navigate(path)
    }

    return (
        <List
            sx={{
                display: "flex",
                flexDirection: "row"
            }}
        >
            {tabs.map((tabname) => (
                <CustomListItem
                    key={tabname}
                    name={tabname}
                    selected={currentTab === tabname}
                    onClick={() => onClickTab(tabname)}
                />
            ))}
        </List>
    )
}

export default NavBar