import React from "react";
import { useState } from "react";
import {
 searchPatientByPhone,
 getAppointments,
 getPrescriptions
} from "../api.js";


export default function Search() {
 const [phone, setPhone] = useState("");
 const [patient, setPatient] = useState(null);
 const [appointments, setAppointments] = useState([]);
 const [prescriptions, setPrescriptions] = useState([]);
 const [loading, setLoading] = useState(false);


 const search = async () => {
   if (!phone) {
     alert("Enter phone number");
     return;
   }


   try {
     setLoading(true);


     // 1. Find patient
     const p = await searchPatientByPhone(phone);


     if (!p) {
       alert("Patient not found");
       setPatient(null);
       setAppointments([]);
       setPrescriptions([]);
       return;
     }


     setPatient(p);


     // 2. Get appointments
     const ap = await getAppointments();
     setAppointments(
       Array.isArray(ap)
         ? ap.filter(a => a.patient_id === p.id)
         : []
     );


     // 3. Get prescriptions
     const pr = await getPrescriptions(p.id);
     setPrescriptions(pr || []);


   } catch (err) {
     console.log(err);
     alert(err.message || "Search failed");
   } finally {
     setLoading(false);
   }
 };


 return (
   <div style={{ padding: "20px" }}>
     <h2>Patient Search</h2>


     <input
       placeholder="Enter phone number"
       value={phone}
       onChange={(e) => setPhone(e.target.value)}
     />


     <button onClick={search} disabled={loading}>
       Search
     </button>


     <hr />


     {!patient ? (
       <p>No patient selected</p>
     ) : (
       <>
         <h3>Patient Info</h3>
         <p><b>Name:</b> {patient.name}</p>
         <p><b>Phone:</b> {patient.phone}</p>
         <p><b>Age:</b> {patient.age}</p>


         <hr />


         <h3>Appointments</h3>
         {appointments.length === 0 ? (
           <p>No appointments</p>
         ) : (
           <ul>
             {appointments.map(a => (
               <li key={a.id}>
                 {new Date(a.date).toLocaleString()}
               </li>
             ))}
           </ul>
         )}


         <hr />


         <h3>Prescriptions</h3>
         {prescriptions.length === 0 ? (
           <p>No prescriptions</p>
         ) : (
           <ul>
             {prescriptions.map(pr => (
               <li key={pr.id}>
                 <b>{pr.medicines}</b> — {pr.notes}
               </li>
             ))}
           </ul>
         )}
       </>
     )}
   </div>
 );
}

