import React from 'react'
import { Container, Button } from 'react-bootstrap'
// import { Link } from 'react-router-dom'
// import heroLeft from '../Images/heroLeft.png'
// import heroLeft2 from '../Images/heroLeft2.png'
// import Bgdots from '../Images/Bgdots.png'
// import Bgdots2 from '../Images/Bgdots2.png'

function HeroSection2() {
    return (
        <Container fluid>
            <div className="d-flex vh-100 flex-row justify-content-center" style={{ overflow: "hidden" }}>
                <h1 className='position-absolute mt-5 fw-bolder'>Find
                    <span className='text-danger'> someone</span> to write those assignments
                </h1>
                <div className="yellow-circle d-flex align-items-start justify-content-center shadow">
                    <Button className='mt-4'>START</Button>
                    {/* <Link className='text-decoration-none fs-5 mt-4 '>START</Link> */}
                </div>
            </div>
        </Container>

    )
}

export default HeroSection2