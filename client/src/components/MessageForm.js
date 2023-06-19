import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";

import { Card } from "react-bootstrap";

function MessageForm() {
    const [message, setMessage] = useState("");
    const user = useSelector((state) => state.user);
    const { socket, currentRoom, setMessages, messages, privateMemberMsg } = useContext(AppContext);
    const messageEndRef = useRef(null);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function getFormattedDate() {
        const date = new Date();
        const year = date.getFullYear();
        let month = (1 + date.getMonth()).toString();

        month = month.length > 1 ? month : "0" + month;
        let day = date.getDate().toString();

        day = day.length > 1 ? day : "0" + day;

        return month + "/" + day + "/" + year;
    }

    function handleSubmit(e) {
        e.preventDefault();
    }

    function scrollToBottom() {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const todayDate = getFormattedDate();

    socket.off("room-messages").on("room-messages", (roomMessages) => {
        setMessages(roomMessages);
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (!message) return;
        const today = new Date();
        const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        const time = today.getHours() + ":" + minutes;
        const roomId = currentRoom;
        socket.emit("message-room", roomId, message, user, time, todayDate);
        setMessage("");
    }
    return (
        <>
            <div className="messages-output">
                {user && !privateMemberMsg?._id && <div className="alert alert-info">You are in the {currentRoom} room</div>}
                {user && privateMemberMsg?._id && (
                    <>
                        <div className="alert alert-info conversation-info">
                            <div>
                                Private with {privateMemberMsg.name}
                            </div>
                        </div>
                    </>
                )}
                {!user && <div className="alert alert-danger">Please login</div>}

                {user &&
                    messages.map(({ _id: date, messagesByDate }, idx) => (
                        <Container style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 30 }}>



                            {messagesByDate?.map(({ content, time, from: sender }, msgIdx) => (



                                <Card style={{ padding: 10, flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', padding: 10, gap: 10, alignItems: 'center' }}>
                                        <span style={{ fontWeight: 700, textTransform: 'capitalize', color: sender._id == user?._id ? "red" : "black" }}> {sender._id == user?._id ? "You" : sender.name} : </span>
                                        <p style={{ display: 'flex', alignItems: 'center', margin: 'auto 0' }}>{content} </p>
                                        <p style={{ display: 'flex', alignItems: 'center', margin: 'auto 0' }}>{time} </p>
                                    </div>

                                    <p style={{ display: 'flex', alignItems: 'center', margin: 'auto 0', }}>{date} </p>



                                </Card>




                            ))}
                        </Container>
                    ))}
                <div ref={messageEndRef} />
            </div >
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={9}>
                        <Form.Group>
                            <Form.Control type="text" placeholder="Message..." disabled={!user} value={message} onChange={(e) => setMessage(e.target.value)}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={1}>
                        <Button variant="primary" type="submit" disabled={!user}>
                            Send
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default MessageForm;
