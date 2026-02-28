import React, { useState, useEffect } from "react";
import api from "../api/axios";

const StudentForm = ({ onCancel, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        rollNo: "",
        contact: "",
        address: "",
        status: "1",
        programId: "",
        semesterId: "",
    });

    const [programs, setPrograms] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [programsRes, semestersRes] = await Promise.all([
                    api.get("/api/program"),
                    api.get("/semesters"),
                ]);
                setPrograms(programsRes.data);
                setSemesters(semestersRes.data);
            } catch (err) {
                console.error("Failed to fetch form data:", err);
                setError("Failed to load required data. Please refresh.");
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validate = () => {
        if (!formData.name || !formData.rollNo || !formData.programId || !formData.semesterId) {
            return "Name, Roll No, Program, and Semester are required.";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            const payload = {
                name: formData.name,
                rollNo: formData.rollNo,
                contact: formData.contact,
                address: formData.address,
                status: parseInt(formData.status),
                program: { id: parseInt(formData.programId) },
                semester: { id: parseInt(formData.semesterId) },
            };

            await api.post("/api/student", payload);
            setSuccess("Student added successfully!");
            setFormData({
                name: "",
                rollNo: "",
                contact: "",
                address: "",
                status: "1",
                programId: "",
                semesterId: "",
            });
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add student");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Create New Student</h3>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="logout-button"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                        Cancel
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div className="form-group">
                    <label>Full Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter Student Name"
                    />
                </div>

                <div className="form-group">
                    <label>Roll Number *</label>
                    <input
                        type="text"
                        name="rollNo"
                        value={formData.rollNo}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter Roll Number"
                    />
                </div>

                <div className="form-group">
                    <label>Contact</label>
                    <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter Contact Number"
                    />
                </div>

                <div className="form-group">
                    <label>Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter Address"
                        rows="3"
                        style={{ resize: "vertical" }}
                    />
                </div>

                <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="form-input">
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                </div>


                <div className="form-group">
                    <label>Program *</label>
                    <select name="programId" value={formData.programId} onChange={handleChange} className="form-input">
                        <option value="">Select Program</option>
                        {programs.map((program) => (
                            <option key={program.id} value={program.id}>
                                {program.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Semester *</label>
                    <select name="semesterId" value={formData.semesterId} onChange={handleChange} className="form-input">
                        <option value="">Select Semester</option>
                        {semesters.map((semester) => (
                            <option key={semester.id} value={semester.id}>
                                {semester.number}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Creating..." : "Create Student"}
                </button>
            </form>
        </div>
    );
};

export default StudentForm;
