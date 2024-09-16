import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Grid,
  IconButton,
  Badge,
  Container,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import EditIcon from "@mui/icons-material/Edit";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
}

interface Column {
  name: string;
  items: Task[];
}

interface BoardData {
  columns: {
    [key: string]: Column;
  };
}

const initialData: BoardData = {
  columns: {
    pending: {
      name: "Pending",
      items: [
        { id: "1", title: "Portlets View", status: "Pending", priority: "High" },
        { id: "2", title: "Bug Fix - User Authentication", status: "Pending", priority: "Medium" },
        { id: "3", title: "Testing Phase 1", status: "Pending", priority: "High" },
        { id: "4", title: "Deployment to Staging", status: "Pending", priority: "High" },
      ],
    },
    notStarted: {
      name: "Not Started",
      items: [
        { id: "5", title: "Spread sheet Task", status: "Not Started", priority: "High" },
        { id: "6", title: "UI Design Update", status: "Not Started", priority: "High" },
      ],
    },
    inProgress: {
      name: "In Progress",
      items: [
        { id: "7", title: "API Integration", status: "In Progress", priority: "Medium" },
        { id: "8", title: "Performance Optimization", status: "In Progress", priority: "High" },
        { id: "9", title: "Code Review", status: "In Progress", priority: "Medium" },
      ],
    },
    completed: {
      name: "Completed",
      items: [
        { id: "10", title: "Database Migration", status: "Completed", priority: "Low" },
        { id: "11", title: "Client Meeting Preparation", status: "Completed", priority: "Low" },
      ],
    },
  },
};

const Board: React.FC = () => {
  const [data, setData] = useState<BoardData>(initialData);
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = data.columns[source.droppableId];
    const destinationColumn = data.columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destinationItems = [...destinationColumn.items];

    const [movedItem] = sourceItems.splice(source.index, 1);
    destinationItems.splice(destination.index, 0, movedItem);

    setData({
      ...data,
      columns: {
        ...data.columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destinationColumn, items: destinationItems },
      },
    });
  };

  const toggleCollapse = (columnId: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  return (
    <Container sx={{ backgroundColor: "#eeeef4", padding: 2 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2}>
          {Object.entries(data.columns).map(([columnId, column]) => (
            <Grid item xs={12} sm={6} md={3} key={columnId}>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{
                      background: "#fff",
                      padding: collapsed[columnId] ? 1 : 2,
                      borderRadius: 2,
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                      minHeight: "200px",
                      overflow: "hidden",
                      width: collapsed[columnId] ? "40px" : "auto",
                      height: "100vh",
                      transition: "width 0.3s ease",
                    }}
                  >
                    
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 1,
                        flexDirection: collapsed[columnId] ? "column" : "row", // Layout for vertical text
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="textPrimary"
                        sx={{
                          writingMode: collapsed[columnId] ? "vertical-rl" : "horizontal-tb", // Vertical text when collapsed
                          transform: collapsed[columnId] ? "none" : "rotate(0deg)",
                          transition: "transform 0.3s ease, writing-mode 0.3s ease",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textAlign: "center", // Align vertically
                        }}
                      >
                        {collapsed[columnId] ? column.name : column.name}
                      </Typography>
                      <IconButton onClick={() => toggleCollapse(columnId)}>
                        {collapsed[columnId] ? (
                          <ArrowForwardIosIcon sx={{ marginTop: "500px" }} />
                        ) : (
                          <ArrowBackIosIcon />
                        )}
                      </IconButton>
                    </Box>

                    {!collapsed[columnId] &&
                      column.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                marginBottom: 2,
                                padding: 1,
                                backgroundColor: "#f9f9f9",
                              }}
                            >
                              <CardContent>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography variant="body1" fontWeight="bold">
                                    {item.title}
                                  </Typography>
                                  <Avatar>
                                    <AccountCircleRoundedIcon />
                                  </Avatar>
                                </Box>

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    marginTop: 1,
                                  }}
                                >
                                  <Chip label={item.priority} size="small" />
                                  <Badge
                                    badgeContent={0}
                                    color="primary"
                                    overlap="rectangular"
                                  >
                                    <ChatBubbleOutlineIcon fontSize="small" />
                                  </Badge>
                                  <EditIcon fontSize="small" />
                                </Box>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
    </Container>
  );
};

export default Board;
