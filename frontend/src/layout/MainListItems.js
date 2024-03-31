import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import { Badge, Collapse, List } from "@material-ui/core";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
//import SyncAltIcon from "@material-ui/icons/SyncAlt";
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
//import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import FingerprintOutlinedIcon from '@mui/icons-material/FingerprintOutlined';
//import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
//import ContactPhoneOutlinedIcon from "@material-ui/icons/ContactPhoneOutlined";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
//import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined';
//import FlashOnIcon from "@material-ui/icons/FlashOn";
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import CodeRoundedIcon from "@material-ui/icons/CodeRounded";
//import EventIcon from "@material-ui/icons/Event";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
//import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
//import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import WysiwygOutlinedIcon from '@mui/icons-material/WysiwygOutlined';
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
//import PeopleIcon from "@material-ui/icons/People";
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
//import ListIcon from "@material-ui/icons/ListAlt";
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
//import AnnouncementIcon from "@material-ui/icons/Announcement";
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
//import ForumIcon from "@material-ui/icons/Forum";
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
//import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import RequestPageOutlinedIcon from '@mui/icons-material/RequestPageOutlined';
import RotateRight from "@material-ui/icons/RotateRight";
import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import LoyaltyRoundedIcon from '@material-ui/icons/LoyaltyRounded';
import { Can } from "../components/Can";
import { socketConnection } from "../services/socket";
import { isArray } from "lodash";
//import TableChartIcon from '@material-ui/icons/TableChart';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import api from "../services/api";
//import BorderColorIcon from '@material-ui/icons/BorderColor';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import ToDoList from "../pages/ToDoList/";
import toastError from "../errors/toastError";
import { makeStyles } from "@material-ui/core/styles";
//import { AllInclusive, AttachFile, DeviceHubOutlined, Schedule } from '@material-ui/icons';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import WebhookOutlinedIcon from '@mui/icons-material/WebhookOutlined';
import PolylineOutlinedIcon from '@mui/icons-material/PolylineOutlined';
import usePlans from "../hooks/usePlans";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  ListSubheader: {
    height: 26,
    marginTop: "-15px",
    marginBottom: "-10px",
  },
}));


function ListItemLink(props) {
  const { icon, primary, to, className } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem button dense component={renderLink} className={className} style={{ color: 'black' }}>
        {icon ? <ListItemIcon style={{ color: 'black' }}>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} style={{ color: 'black' }} />
      </ListItem>
    </li>
  );
}

const reducer = (state, action) => {
  if (action.type === "LOAD_CHATS") {
    const chats = action.payload;
    const newChats = [];

    if (isArray(chats)) {
      chats.forEach((chat) => {
        const chatIndex = state.findIndex((u) => u.id === chat.id);
        if (chatIndex !== -1) {
          state[chatIndex] = chat;
        } else {
          newChats.push(chat);
        }
      });
    }

    return [...state, ...newChats];
  }

  if (action.type === "UPDATE_CHATS") {
    const chat = action.payload;
    const chatIndex = state.findIndex((u) => u.id === chat.id);

    if (chatIndex !== -1) {
      state[chatIndex] = chat;
      return [...state];
    } else {
      return [chat, ...state];
    }
  }

  if (action.type === "DELETE_CHAT") {
    const chatId = action.payload;

    const chatIndex = state.findIndex((u) => u.id === chatId);
    if (chatIndex !== -1) {
      state.splice(chatIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }

  if (action.type === "CHANGE_CHAT") {
    const changedChats = state.map((chat) => {
      if (chat.id === action.payload.chat.id) {
        return action.payload.chat;
      }
      return chat;
    });
    return changedChats;
  }
};

const MainListItems = (props) => {
  const classes = useStyles();
  const { drawerClose, collapsed } = props;
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user, handleLogout } = useContext(AuthContext);
  const [connectionWarning, setConnectionWarning] = useState(false);
  const [openCampaignSubmenu, setOpenCampaignSubmenu] = useState(false);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [showKanban, setShowKanban] = useState(false);
  const [showOpenAi, setShowOpenAi] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false); const history = useHistory();
  const [showSchedules, setShowSchedules] = useState(false);
  const [showInternalChat, setShowInternalChat] = useState(false);
  const [showExternalApi, setShowExternalApi] = useState(false);

  const [invisible, setInvisible] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam] = useState("");
  const [chats, dispatch] = useReducer(reducer, []);
  const { getPlanCompany } = usePlans();

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    async function fetchData() {
      const companyId = user.companyId;
      const planConfigs = await getPlanCompany(undefined, companyId);

      setShowCampaigns(planConfigs.plan.useCampaigns);
      setShowKanban(planConfigs.plan.useKanban);
      setShowOpenAi(planConfigs.plan.useOpenAi);
      setShowIntegrations(planConfigs.plan.useIntegrations);
      setShowSchedules(planConfigs.plan.useSchedules);
      setShowInternalChat(planConfigs.plan.useInternalChat);
      setShowExternalApi(planConfigs.plan.useExternalApi);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchChats();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketConnection({ companyId });

    socket.on(`company-${companyId}-chat`, (data) => {
      if (data.action === "new-message") {
        dispatch({ type: "CHANGE_CHAT", payload: data });
      }
      if (data.action === "update") {
        dispatch({ type: "CHANGE_CHAT", payload: data });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    let unreadsCount = 0;
    if (chats.length > 0) {
      for (let chat of chats) {
        for (let chatUser of chat.users) {
          if (chatUser.userId === user.id) {
            unreadsCount += chatUser.unreads;
          }
        }
      }
    }
    if (unreadsCount > 0) {
      setInvisible(false);
    } else {
      setInvisible(true);
    }
  }, [chats, user.id]);

  useEffect(() => {
    if (localStorage.getItem("cshow")) {
      setShowCampaigns(true);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  const fetchChats = async () => {
    try {
      const { data } = await api.get("/chats/", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_CHATS", payload: data.records });
    } catch (err) {
      toastError(err);
    }
  };

  const handleClickLogout = () => {
    //handleCloseMenu();
    handleLogout();
  };

  return (
    <div onClick={drawerClose}>
      <Can
        role={user.profile}
        perform={"drawer-service-items:view"}
        style={{
          overflowY: "scroll",
        }}
        no={() => (
          <>
            <ListSubheader
              hidden={collapsed}
              style={{
                position: "relative",
                fontSize: "17px",
                textAlign: "left",
                paddingLeft: 20
              }}
              inset
              color="inherit">
              {i18n.t("Atendimento")}
            </ListSubheader>
            <>

              <ListItemLink
                to="/tickets"
                primary={i18n.t("mainDrawer.listItems.tickets")}
                icon={<WhatsAppIcon style={{ color: 'black' }} />}
              />
              <ListItemLink
                to="/quick-messages"
                primary={i18n.t("mainDrawer.listItems.quickMessages")}
                icon={<DynamicFormIcon style={{ color: 'black' }} />}
              />
              {showKanban && (
                <ListItemLink
                  to="/kanban"
                  primary="Kanban"
                  icon={<SpaceDashboardIcon style={{ color: 'black' }} />}
                />
              )}
              <ListItemLink
                to="/todolist"
                primary={i18n.t("Tarefas")}
                icon={<PendingActionsOutlinedIcon style={{ color: 'black' }} />}
              />
              {showSchedules && (
                <>
                  <ListItemLink
                    to="/schedules"
                    primary={i18n.t("mainDrawer.listItems.schedules")}
                    icon={<CalendarMonthOutlinedIcon style={{ color: 'black' }} />}
                  />
                </>
              )}
              <ListItemLink
                to="/tags"
                primary={i18n.t("mainDrawer.listItems.tags")}
                icon={<DiscountOutlinedIcon style={{ color: 'black' }} />}
              />
              {showInternalChat && (
                <>
                  <ListItemLink
                    to="/chats"
                    primary={i18n.t("mainDrawer.listItems.chats")}
                    icon={
                      <Badge color="secondary" variant="dot" invisible={invisible}>
                        <ForumOutlinedIcon style={{ color: 'black' }} />
                      </Badge>
                    }
                  />
                </>
              )}
              <ListItemLink
                to="/helps"
                primary={i18n.t("mainDrawer.listItems.helps")}
                icon={<HelpOutlineIcon style={{ color: 'black' }} />}
              />
            </>
          </>
        )}
      />

      <Can
        role={user.profile}
        perform={"drawer-admin-items:view"}
        yes={() => (
          <>
            <Divider />
            <ListSubheader
              hidden={collapsed}
              style={{
                position: "relative",
                fontSize: "17px",
                textAlign: "left",
                paddingLeft: 20
              }}
              inset
              color="inherit">
              {i18n.t("Painel Principal")}
            </ListSubheader>
            <ListItemLink
              small
              to="/"
              primary="Dashboard"
              icon={<DashboardOutlinedIcon style={{ color: 'black' }} />}
            />
          </>
        )}
      />
      <Can
        role={user.profile}
        perform="drawer-admin-items:view"
        yes={() => (
          <>
            <Divider />
            <ListSubheader
              hidden={collapsed}
              style={{
                position: "relative",
                fontSize: "17px",
                textAlign: "left",
                paddingLeft: 20
              }}
              inset
              color="inherit">
              {i18n.t("mainDrawer.listItems.management")}
            </ListSubheader>

            {showCampaigns && (
              <>
                <ListItem
                  button
                  onClick={() => setOpenCampaignSubmenu((prev) => !prev)}
                >
                  <ListItemIcon>
                    <WysiwygOutlinedIcon style={{ color: 'black' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={i18n.t("mainDrawer.listItems.campaigns")}
                  />
                  {openCampaignSubmenu ? (
                    <ExpandLessIcon style={{ color: 'black' }} />
                  ) : (
                    <ExpandMoreIcon style={{ color: 'black' }} />
                  )}
                </ListItem>
                <Collapse
                  style={{ paddingLeft: 15 }}
                  in={openCampaignSubmenu}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <ListItem onClick={() => history.push("/campaigns")} button>
                      <ListItemIcon>
                        <AssignmentOutlinedIcon style={{ color: 'black' }} />
                      </ListItemIcon>
                      <ListItemText primary="Listagem" />
                    </ListItem>
                    <ListItem
                      onClick={() => history.push("/contact-lists")}
                      button
                    >
                      <ListItemIcon>
                        <PermIdentityOutlinedIcon style={{ color: 'black' }} />
                      </ListItemIcon>
                      <ListItemText primary="Listas de Contatos" />
                    </ListItem>
                    <ListItem
                      onClick={() => history.push("/campaigns-config")}
                      button
                    >
                      <ListItemIcon>
                        <FingerprintOutlinedIcon style={{ color: 'black' }} />
                      </ListItemIcon>
                      <ListItemText primary="Configurações" />
                    </ListItem>
                  </List>
                </Collapse>
              </>
            )}
            {user.super && (
              <ListItemLink
                to="/announcements"
                primary={i18n.t("mainDrawer.listItems.annoucements")}
                icon={<ReportGmailerrorredOutlinedIcon style={{ color: 'black' }} />}
              />
            )}
            {showOpenAi && (
              <ListItemLink
                to="/prompts"
                primary={i18n.t("mainDrawer.listItems.prompts")}
                icon={<WebhookOutlinedIcon style={{ color: 'black' }} />}
              />
            )}

            {showIntegrations && (
              <ListItemLink
                to="/queue-integration"
                primary={i18n.t("mainDrawer.listItems.queueIntegration")}
                icon={<PolylineOutlinedIcon style={{ color: 'black' }} />}
              />
            )}
            <ListItemLink
              to="/connections"
              primary={i18n.t("mainDrawer.listItems.connections")}
              icon={
                <Badge badgeContent={connectionWarning ? "!" : 0} color="error">
                  <SwapHorizOutlinedIcon style={{ color: 'black' }} />
                </Badge>
              }
            />
            <ListItemLink
              to="/files"
              primary={i18n.t("mainDrawer.listItems.files")}
              icon={<CloudOutlinedIcon style={{ color: 'black' }} />}
            />
            <ListItemLink
              to="/queues"
              primary={i18n.t("mainDrawer.listItems.queues")}
              icon={<ViewAgendaOutlinedIcon style={{ color: 'black' }} />}
            />
            <ListItemLink
              to="/users"
              primary={i18n.t("mainDrawer.listItems.users")}
              icon={<GroupsOutlinedIcon style={{ color: 'black' }} />}
            />
            {showExternalApi && (
              <>
                <ListItemLink
                  to="/messages-api"
                  primary={i18n.t("mainDrawer.listItems.messagesAPI")}
                  icon={<CodeRoundedIcon style={{ color: 'black' }} />}
                />
              </>
            )}
            <ListItemLink
                to="/contacts"
                primary={i18n.t("mainDrawer.listItems.contacts")}
                icon={<PeopleAltOutlinedIcon style={{ color: 'black' }} />}
              />
            <ListItemLink
              to="/financeiro"
              primary={i18n.t("mainDrawer.listItems.financeiro")}
              icon={<RequestPageOutlinedIcon style={{ color: 'black' }} />}
            />

            <ListItemLink
              to="/settings"
              primary={i18n.t("mainDrawer.listItems.settings")}
              icon={<FingerprintOutlinedIcon style={{ color: 'black' }} />}
            />			
			
            {!collapsed && <React.Fragment>
              <Divider />
              {/* 
              // IMAGEM NO MENU
              <Hidden only={['sm', 'xs']}>
                <img style={{ width: "100%", padding: "10px" }} src={logo} alt="image" />            
              </Hidden> 
              */}
              <Typography style={{ fontSize: "12px", padding: "10px", textAlign: "right", fontWeight: "bold", color: 'black' }}>
                Versão: 0.3.0
              </Typography>
            </React.Fragment>
            }
			
          </>
        )}
      />
    </div>
  );
};

export default MainListItems;
