// import React from 'react';
// import {

//     Container,
//     Button,
// } from 'react-bootstrap';
// import { Link } from 'react-router-dom'


// function Footer() {
//     return (
//         <footer className='text-center text-light' style={{ backgroundColor: '#0a4275' }}>
//             <Container className='p-4 pb-0'>
//                 <section className=''>
//                     <p className='d-flex justify-content-center align-items-center'>
//                         <span className='me-2'>Register for free</span>
//                         <Link type='button' to={'/signup'} className="text-warning ">
//                             Sign up!
//                         </Link>
//                     </p>
//                 </section>
//             </Container>

//             <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
//                 © 2022 Copyright:
//                 <a className='text-light text' href='https://Assignmentor.live/'>
//                     Assignmentor.live
//                 </a>
//             </div>
//         </footer>
//     );
// }

// export default Footer

import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import Alogo from '../Images/Footerlogo.png'


const Footer = () => (
    <Container fluid className="pb-0 mb-0 justify-content-center text-light ">
        <footer>
            <Row className="justify-content-start mb-0 pt-3 pb-0 row-2 px-2">
                {/* <h5 className="text-center">
                <span>
                    <i className="fa fa-firefox text-light" aria-hidden="true"></i>
                </span>
                <b> Assignmentor</b>
            </h5> */}

                <Col xs={12}>
                    <Row className="row-2 pt-3">

                        <Col sm={4}  className=" my-sm-0 mt-5">
                            <div>
                                <Container className="text-start isMobCntr">
                                    <Image alt="logo" draggable={false} fluid width={"250px"} src={Alogo}>
                                    </Image>
                                    <span style={{fontSize:".5rem",color:"rgb(111, 137, 253)",verticalAlign:"sub"}} className="fw-bolder">BETA</span>
                                </Container>
                            </div>
                        </Col>
                        <Col sm={4} className=" my-sm-0 mt-5">
                            <ul className="list-unstyled isMobCntr">
                                <li className="mt-0">Locations</li>
                                <li>Gurgaon</li>
                                <li>Delhi</li>
                            </ul>
                        </Col>
                        <Col sm={4} className=" my-sm-0 mt-5">
                            <ul className="list-unstyled isMobCntr">
                                <li className="mt-0">Report</li>
                                {/* <li>Use Cases</li> */}
                            </ul>
                        </Col>


                    </Row>
                </Col>
            </Row>
        </footer>
    </Container>
)

export default Footer



