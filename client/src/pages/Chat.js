import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import MessageForm from "../components/MessageForm";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'

function Chat() {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            navigate('/');
        }


    }, [])

    return (
        <Container>
            <Row>
                <Col md={7}>
                    <MessageForm />
                </Col>
                <Col md={5}>
                    <Sidebar />

                </Col>
            </Row>
        </Container>
    );
}

export default Chat;
