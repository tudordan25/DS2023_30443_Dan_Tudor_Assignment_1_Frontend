import {Card, Col, Row} from "react-bootstrap";
import SockJsClient from "react-stomp";
import React from "react";
import ChatGRPC from "./Chat/ChatGRPC"

const CustomerView = (props) => {
    const SOCKET_URL = 'http://localhost:8081/backend/stomp';

    let onMessageReceived = (msg) => {
        console.log(msg);
    }

    return (
        <>
            <Row>

                <Col>
                    <Card body className="cardA" style={{ width: '30rem' }}>
                        welcome {props.username} .
                    </Card>
                </Col>
            </Row>
            <ChatGRPC/>
            <SockJsClient
                url={SOCKET_URL}
                topics={['/topic/message']}
                onConnect={console.log("Connected!!")}
                onDisconnect={console.log("Disconnected!")}
                onMessage={msg => onMessageReceived(msg)}
                //ref={ (client) => { this.clientRef = client }}
                debug={false}
            />
        </>
    );
};

export default CustomerView;