import {Card, Col, Row} from "react-bootstrap";

const CustomerView = (props) => {

    return (
        <>
            <Row>

                <Col>
                    <Card body className="cardA" style={{ width: '30rem' }}>
                        welcome {props.username} .
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default CustomerView;