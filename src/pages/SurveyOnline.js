import { ArrowLeftIcon } from '@heroicons/react/outline';
import React, { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { url_api_view } from '../components/constant';
import { useAlert } from 'react-alert';

function SurveyOnline() {
    const { slug } = useParams();
    const petugas_pst = [
        {
            id: 340055818,
            name: "juned",
            fullname: "Junedi"
        },
        {
            id: 340056221,
            name: "arizka",
            fullname: "Arizka Selviana"
        },
        {
            id: 340056900,
            name: "suci",
            fullname: "Suci Safitriani"
        },
        {
            id: 340058661,
            name: "damara",
            fullname: "Damara Utama"
        },

    ]

    const matchingElement = petugas_pst.find(element => element.name === slug);
    const [p1, setP1] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const startFillArray = [
        '#f14f45',
        '#f14f45',
        '#f18845',
        '#f19745',
        '#f1d045',
        '#f1de45'
    ];

    const startTooltipArray = [
        'Bad',
        'Bad+',
        'Average',
        'Average+',
        'Great',
        'Great+',
    ];
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const navigate = useNavigate();
    const alert = useAlert();

    const [saran, setSaran] = useState("");
    const refSaran = useRef(null);

    const isSaranError = () =>{
        if ((p1 < 6) && saran=="" ) 
        {
            return true;
        }
        return false;

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("handle submit");
        console.log(p1);
        setShowErrorMessage(true);
        if(p1>0 && !isSaranError()){
            setIsLoading(true);
            const data = {
                p1: p1,
                niplama_petugas: matchingElement.id,
                saran: refSaran.current.value
            }
            console.log("data", data);
            fetch(url_api_view + "/records/survey_online", {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                    alert.success("Data berhasil tersimpan");
                    setTimeout(() => { navigate("/"); }, 3000);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert.error("Data gagal tersimpan");
                    setIsLoading(false);
                });

        }

    }

    return (
        <div>
            {matchingElement ? (
                <div>
                    {/* <div>Survey Online {slug}</div>
                <div>{matchingElement.name}</div>
                <div>{matchingElement.id}</div> */}

                    <div className="full-height-min-10 bg-gradient-to-r from-gradient3/30 via-gradient2/80 to-gradient1/40 flex flex-col justify-center py-10">
                        {/* <div className="relative sm:max-w-4xl sm:mx-auto"> */}
                        <Link to="/" style={{ position: "absolute", top: 10, left: 10, display: "flex" }} className="custombutton"><ArrowLeftIcon className="text-black h-6 w-6" style={{ marginRight: 10 }} aria-hidden="true" /> Back</Link>
                        <div className="relative md:max-w-5xl md:mx-auto">
                            {/* <div className="relative sm:container sm:mx-auto"> */}
                            <div className="px-10 py-10 bg-white shadow-md rounded-3xl sm:p-10">
                                <div className="mx-auto">
                                    {/* Headline */}
                                    <div className="font-sans text-gray-700 space-y-2 sm:leading-7 text-center antialiased">
                                        <h1 id="title" className="text-3xl font-semibold">Survey Kepuasan Pelayanan</h1>
                                        <p id="description" className="text-lg">BPS Provinsi Sulawesi Tenggara</p>
                                        <Rating style={{ display: "none" }} />

                                    </div>
                                    {/* Form */}

                                    <form id="survey-form" onSubmit={handleSubmit}>
                                        <div className="col-span-6 sm:col-span-6">
                                            <label id="email-label" htmlFor="email" className="block text-sm font-medium text-gray-600">
                                                Nama Petugas Pelayanan
                                            </label>
                                            <select disabled style={{border:"1px solid black", width:"100%", height: "40px", marginBottom:"10px"}}>
                                                <option>{matchingElement.fullname}</option>
                                            </select>
                                        </div>
                                        <div className="col-span-6 sm:col-span-6">
                                            <label id="email-label" htmlFor="email" className="block text-sm font-medium text-gray-600">
                                            Kepuasan terkait pelayanan
                                            </label>
                                            {/* <Smiley setValue={setP1} /> */}
                                            <Rating
                                                fillColorArray={startFillArray}
                                                iconsCount={6}
                                                showTooltip
                                                tooltipArray={startTooltipArray}
                                                transition
                                                onClick={(val, val2)=>{setP1(val2+1);}}
                                            />
                                            
                                            <p className="block text-sm font-medium" style={{ color: "red", display: showErrorMessage && p1 == 0 ? "flex" : "none" }}>Isian tidak boleh kosong</p>
                                        </div>

                                        <div className="col-span-6 sm:col-span-6" style={{marginTop:"10px"}}>
                                            <label id="email-label" htmlFor="email" className="block text-sm font-medium text-gray-600">
                                                Saran terkait petugas pelayanan {(matchingElement.fullname)}
                                            </label>
                                            <textarea rows={5} cols={40} style={{width: "100%", border: "1px solid black", padding:10}}
                                                placeholder={"Isikan saran terkait pelayanan "+(matchingElement.fullname)}
                                                ref={refSaran}
                                                onChange={(e)=>{setSaran(e.target.value);}}
                                            />
                                            <p className="block text-sm font-medium" style={{ color: "red", display: showErrorMessage && isSaranError() ? "flex" : "none" }}>Ada layanan &lt; 6, mohon isikan saran perbaikan</p>
                                        </div>

                                        <div className="col-span-6 sm:col-span-2 mt-2">
                                            <button disabled={isLoading} type="submit" className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                <div className="flex items-center justify-center" style={{ marginRight: 10, display: isLoading ? "flex" : "none" }} >
                                                    <div className="w-5 h-5 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                                                </div>
                                                Submit
                                            </button>
                                        </div>


                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            ) : <p>Petugas is not found</p>}

        </div>


    )
}

export default SurveyOnline