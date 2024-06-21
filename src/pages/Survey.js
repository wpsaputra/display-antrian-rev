import { ArrowLeftIcon } from '@heroicons/react/outline'
import React from 'react'
import { useState } from 'react';
import { useRef } from 'react';
import { useAlert } from 'react-alert';
import { Link, useNavigate } from 'react-router-dom'
import { Rating } from 'react-simple-star-rating';
import { url_api, url_api_view, url_image, url_image_onedata } from '../components/constant';
import Smiley from '../components/Smiley';
import AsyncSelect from 'react-select/async';

export default function Survey() {
    const [p1, setP1] = useState(0);
    const [p2, setP2] = useState(0);
    const [p3, setP3] = useState(0);
    const [p4, setP4] = useState(0);
    const [p5, setP5] = useState(0);
    const [p6, setP6] = useState(0);
    const [p7, setP7] = useState(0);
    
    const [saran, setSaran] = useState("");
    const [id_pengunjung, setid_pengunjung] = useState(0);
    const [niplama_petugas, setNiplamaPetugas] = useState(0);


    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const alert = useAlert();
    const navigate = useNavigate();
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

    const refSaran = useRef(null);

    const fetchQueue = async () => {
        let date = new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2);
        const data = await fetch(url_api_view + `/records/queue?order=id,asc&filter=waktu_kunjungan,sw,${date}`);
        const apiResponse = await data.json();
        // const sortedData = apiResponse.sort((a,b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        const sortedData = apiResponse.records;
        
        let options = [];
        for (let index = 0; index < sortedData.length; index++) {
            const element = sortedData[index];
            let temp = {
                value: element["id"],
                label: element["nama_pengunjung"],
                image : url_image+element["foto_pengunjung_path"]
            }
            options.push(temp);
        }
        console.log("options", options);
        return options;

    }

    const fetchPetugasPST = async () => {
        let date = new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2);
        const data = await fetch(url_api_view + `/records/petugas_pst?order=nama,asc`);
        const apiResponse = await data.json();
        // const sortedData = apiResponse.sort((a,b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        const sortedData = apiResponse.records;
        
        let options = [];
        for (let index = 0; index < sortedData.length; index++) {
            const element = sortedData[index];
            let temp = {
                value: element["id"],
                label: element["nama"],
                image : url_image_onedata+element["image_path"]
            }
            options.push(temp);
        }
        console.log("options", options);
        // return options;

        const d = new Date();
        let sesi = d.getHours()>12? 2:1;

        const data2 = await fetch(url_api_view + `/records/jadwal_piket_view?filter=sesi,eq,${sesi}&filter=tanggal,eq,${d.toISOString().slice(0, 10)}&order=date_created,desc`);
        const apiResponse2 = await data2.json();
        const sortedData2 = apiResponse2.records[0];

        console.log("apiResponse2", apiResponse2);
        console.log("sortedData2", sortedData2);

        let options2 = [];
        let temp = {
            value: sortedData2["petugas1"],
            label: sortedData2["petugas1_nama"],
            image : url_image_onedata + sortedData2["petugas1_image_path"]
        };

        let temp2 = {
            value: sortedData2["petugas2"],
            label: sortedData2["petugas2_nama"],
            image : url_image_onedata + sortedData2["petugas2_image_path"]
        };

        let temp3 = {
            value: sortedData2["petugas3"],
            label: sortedData2["petugas3_nama"],
            image : url_image_onedata + sortedData2["petugas3_image_path"]
        };

        let temp4 = {
            value: sortedData2["petugas4"],
            label: sortedData2["petugas4_nama"],
            image : url_image_onedata + sortedData2["petugas4_image_path"]
        };


        options2.push(temp);
        options2.push(temp2);
        options2.push(temp3);
        options2.push(temp4);

        console.log("options2", options2);

        if(options2.length>0){
            return options2;

        }
        return options;



    }

    const isSaranError = () =>{
        if ((p1 < 6 || p2 < 6 || p3 < 6 || p4 < 6 || p5 < 6 || p6 < 6 || p7 < 6 ) && saran=="" ) 
        {
            return true;
        }
        return false;

    }

    const isGetReward = () =>{
        if (p1 < 4 || p2 < 4 || p3 < 4 || p4 < 4 || p5 < 4 || p4 < 4 || p7 < 4  ) 
        {
            return true;
        }
        return false;

    }


    

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("handle submit");
        setShowErrorMessage(true);
        if (p1 > 0 && p2 > 0 && p3 > 0 && p4 > 0 && p5 > 0 && p6 > 0 && p7 > 0  
            && id_pengunjung > 0 && niplama_petugas > 0 && !isSaranError()) 
        {
            setIsLoading(true);
            const data = {
                p1: p1,
                p2: p2,
                p3: p3,
                p4: p4,
                p5: p5,
                p6: p6,
                p7: p7,
                
                saran: refSaran.current.value,
                id_pengunjung: id_pengunjung,
                niplama_petugas: niplama_petugas
            };

            console.log("data", data);

            fetch(url_api_view + "/records/penilaian", {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                    if(isGetReward()){
                        alert.success(<div><p>Data berhasil tersimpan. <b>Mohon maaf</b> atas kekurangan pelayanan kami, silahkan <b>hubungi petugas PST</b> untuk mendapatkan <b>Reward</b> aduan pelayanan.*</p> <p style={{fontSize: "11px", marginTop: "20px"}}><b>*Syarat dan ketentuan berlaku.</b></p></div>);
                    }else{
                        alert.success("Data berhasil tersimpan");
                    }
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

        <div className="full-height-min-10 bg-gradient-to-r from-gradient3/30 via-gradient2/80 to-gradient1/40 flex flex-col justify-center py-10">
            {/* <div className="relative sm:max-w-4xl sm:mx-auto"> */}
            <Link to="/" style={{ position: "absolute", top: 10, left: 10, display: "flex" }} className="custombutton"><ArrowLeftIcon className="text-black h-6 w-6" style={{ marginRight: 10 }} aria-hidden="true" /> Back</Link>
            <div className="relative md:max-w-5xl md:mx-auto">
                {/* <div className="relative sm:container sm:mx-auto"> */}
                <div className="px-10 py-10 bg-white shadow-md rounded-3xl sm:p-10">
                    <div className="mx-auto">
                        {/* Headline */}
                        <div className="font-sans text-gray-700 space-y-2 sm:leading-7 text-center antialiased">
                            <h1 id="title" className="text-3xl font-semibold">Survey Kepuasan Petugas Pelayanan</h1>
                            <p id="description" className="text-lg">BPS Provinsi Sulawesi Tenggara</p>
                            <Rating style={{display: "none"}} />
                            
                        </div>
                        {/* Form */}
                        <form id="survey-form" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-6 gap-4 pt-8">
                                <div className="col-span-6 sm:col-span-6">
                                    <label id="email-label" htmlFor="email" className="block text-sm font-medium text-gray-600">
                                        Nama Pengunjung
                                    </label>
                                    {/* <input type="text" style={{width: "100%", border: "1px solid black", padding:10}} /> */}
                                    <AsyncSelect cacheOptions defaultOptions loadOptions={fetchQueue} 
                                        formatOptionLabel={(data)=>(
                                            <div style={{display: "flex", flexDirection: "row"}}>
                                                <img src={data.image} alt="data-image" width={100} />
                                                <span style={{alignSelf: "center", marginLeft: 10}}>{data.label}</span>
                                            </div>
                                        )}
                                        onChange={(data)=>{setid_pengunjung(data.value)}}
                                        isSearchable={false}
                                    />
                                    <p className="block text-sm font-medium" style={{ color: "red", display: showErrorMessage && id_pengunjung == 0 ? "flex" : "none" }}>Isian tidak boleh kosong</p>
                                </div>

                                <div className="col-span-6 sm:col-span-6">
                                    <label id="email-label" htmlFor="email" className="block text-sm font-medium text-gray-600">
                                        Nama Petugas Pelayanan
                                    </label>
                                    <AsyncSelect cacheOptions defaultOptions loadOptions={fetchPetugasPST} 
                                        formatOptionLabel={(data)=>(
                                            <div style={{display: "flex", flexDirection: "row"}}>
                                                <img src={data.image} alt="data-image" width={100} />
                                                <span style={{alignSelf: "center", marginLeft: 10}}>{data.label}</span>
                                            </div>
                                        )}
                                        onChange={(data)=>{setNiplamaPetugas(data.value)}}
                                        isSearchable={false}
                                    />
                                    <p className="block text-sm font-medium" style={{ color: "red", display: showErrorMessage && niplama_petugas == 0 ? "flex" : "none" }}>Isian tidak boleh kosong</p>
                                </div>

                                <div className="col-span-6 sm:col-span-6">
                                    <label id="email-label" htmlFor="email" className="block text-sm font-medium text-gray-600">
                                    Petugas pelayanan merespon dengan baik
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
                                    {/* <div className="mt-1 flex rounded-md">
                                        <input id="email" type="email" name="name" className="form-input block w-full h-10 px-4 mb-2 border border-gray-300 rounded-md sm:text-sm placeholder-gray-400" placeholder="Your email address" required />
                                    </div> */}
                                </div>
                                <div className="col-span-6 sm:col-span-6">
                                    <label id="email-label" htmlFor="email" className="block text-sm font-medium text-gray-600">
                                         Kerapihan Petugas Pelayanan
                                    </label>
                                    {/* <Smiley setValue={setP2} /> */}
                                    <Rating
                                        fillColorArray={startFillArray}
                                        iconsCount={6}
                                        showTooltip
                                        tooltipArray={startTooltipArray}
                                        transition
                                        onClick={(val, val2)=>{setP2(val2+1);}}
                                    />
                                    <p className="block text-sm font-medium" style={{ color: "red", display: showErrorMessage && p2 == 0 ? "flex" : "none" }}>Isian tidak boleh kosong</p>
                                </div>
                                <div className="col-span-6 sm:col-span-6">
                                    <label id="email-label" htmlFor="email" className="block text-sm font-medium text-gray-600">
                                        Petugas Pelayanan Menerapkan Budaya Senyum
                                    </label>
                                    {/* <Smiley setValue={setP3} /> */}
                                    <Rating
                                        fillColorArray={startFillArray}
                                        iconsCount={6}
                                        showTooltip
                                        tooltipArray={startTooltipArray}
                                        transition
                                        onClick={(val, val2)=>{setP3(val2+1);}}
                                    />
                                    <p className="block text-sm font-medium" style={{ color: "red", display: showErrorMessage && p3 == 0 ? "flex" : "none" }}>Isian tidak boleh kosong</p>
                                </div>
                                <div className="col-span-6 sm:col-span-6">
                                    <label id="email-label" htmlFor="email" className="block text-sm font-medium text-gray-600">
                                    Petugas Pelayanan Menerapkan Budaya Sapa
                                    </label>
                                    {/* <Smiley setValue={setP4} /> */}
                                    <Rating
                                        fillColorArray={startFillArray}
                                        iconsCount={6}
                                        showTooltip
                                        tooltipArray={startTooltipArray}
                                        transition
                                        onClick={(val, val2)=>{setP4(val2+1);}}
                                    />
                                    <p className="block text-sm font-medium" style={{ color: "red", display: showErrorMessage && p4 == 0 ? "flex" : "none" }}>Isian tidak boleh kosong</p>
                                </div>
                                <div className="col-span-6 sm:col-span-6">
                                    <label id="email-label" htmlFor="email" className="block text-sm font-medium text-gray-600">
                                    Petugas Pelayanan Menerapkan Budaya Salam
                                    </label>
                                    {/* <Smiley setValue={setP5} /> */}
                                    <Rating
                                        fillColorArray={startFillArray}
                                        iconsCount={6}
                                        showTooltip
                                        tooltipArray={startTooltipArray}
                                        transition
                                        onClick={(val, val2)=>{setP5(val2+1);}}
                                    />
                                    <p className="block text-sm font-medium" style={{ color: "red", display: showErrorMessage && p5 == 0 ? "flex" : "none" }}>Isian tidak boleh kosong</p>
                                </div>
                                <div className="col-span-6 sm:col-span-6">
                                    <label id="email-label" htmlFor="email" className="block text-sm font-medium text-gray-600">
                                    Petugas Pelayanan Menerapkan Budaya Sopan
                                    </label>
                                    {/* <Smiley setValue={setP6} /> */}
                                    <Rating
                                        fillColorArray={startFillArray}
                                        iconsCount={6}
                                        showTooltip
                                        tooltipArray={startTooltipArray}
                                        transition
                                        onClick={(val, val2)=>{setP6(val2+1);}}
                                    />
                                    <p className="block text-sm font-medium" style={{ color: "red", display: showErrorMessage && p6 == 0 ? "flex" : "none" }}>Isian tidak boleh kosong</p>
                                </div>
                                <div className="col-span-6 sm:col-span-6">
                                    <label id="email-label" htmlFor="email" className="block text-sm font-medium text-gray-600">
                                    Petugas Pelayanan Menerapkan Budaya Santun
                                    </label>
                                    {/* <Smiley setValue={setP7} /> */}
                                    <Rating
                                        fillColorArray={startFillArray}
                                        iconsCount={6}
                                        showTooltip
                                        tooltipArray={startTooltipArray}
                                        transition
                                        onClick={(val, val2)=>{setP7(val2+1);}}
                                    />
                                    <p className="block text-sm font-medium" style={{ color: "red", display: showErrorMessage && p7 == 0 ? "flex" : "none" }}>Isian tidak boleh kosong</p>
                                </div>
                                
                                

                                <div className="col-span-6 sm:col-span-6">
                                    <label id="email-label" htmlFor="email" className="block text-sm font-medium text-gray-600">
                                        Saran terkait petugas pelayanan secara keseluruhan (Opsional)
                                    </label>
                                    <textarea rows={5} cols={40} style={{width: "100%", border: "1px solid black", padding:10}}
                                        placeholder="Isikan saran terkait pelayanan secara keseluruhan (Opsional)"
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
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}