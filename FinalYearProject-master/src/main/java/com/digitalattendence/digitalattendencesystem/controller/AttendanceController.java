package com.digitalattendence.digitalattendencesystem.controller;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.http.*;
import java.io.ByteArrayOutputStream;
import com.digitalattendence.digitalattendencesystem.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
        import java.util.List;

import com.digitalattendence.digitalattendencesystem.model.Attendance;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {


    @Autowired
    private AttendanceRepository repository;  // ✅ Inject repository

    // Get all
    @GetMapping
    public List<Attendance> getAll() {
        return repository.findAll();  // ✅ Works now
    }

    // Create new attendance
    @PostMapping
    public Attendance create(@RequestBody Attendance att) {
        return repository.save(att);  // ✅ Works now
    }
    // ✅ Get attendance of particular student for particular subject
    @GetMapping("/student-subject")
    public List<Attendance> getAttendanceByStudentAndSubject(
            @RequestParam Long studentId,
            @RequestParam Long subjectId) {

        return repository.findByStudentIdAndSubjectId(studentId, subjectId);
    }
    @GetMapping("/generate-report")
    public ResponseEntity<byte[]> generateReport(
            @RequestParam Long studentId,
            @RequestParam Long subjectId) {

        try {
            List<Attendance> attendanceList = repository.findByStudentIdAndSubjectId(studentId, subjectId);

            if (attendanceList.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            var student = attendanceList.get(0).getStudent();
            var subject = attendanceList.get(0).getSubject();

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("Attendance Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            Font normalFont = new Font(Font.FontFamily.HELVETICA, 12);
            document.add(new Paragraph("Student: " + student.getName(), normalFont));
            document.add(new Paragraph("Roll No: " + student.getRollNo(), normalFont));
            document.add(new Paragraph("Program: " + student.getProgram().getName(), normalFont));
            document.add(new Paragraph("Semester: " + student.getSemester().getNumber(), normalFont));
            document.add(new Paragraph("Subject: " + subject.getName() + " (" + subject.getCode() + ")", normalFont));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.addCell("Date");
            table.addCell("Status");

            int present = 0, absent = 0, leave = 0;
            for (Attendance att : attendanceList) {
                table.addCell(att.getDate().toString());
                String status = att.getStatus().equals("P") ? "Present" :
                        att.getStatus().equals("A") ? "Absent" : "Leave";
                table.addCell(status);

                if (att.getStatus().equals("P")) present++;
                else if (att.getStatus().equals("A")) absent++;
                else if (att.getStatus().equals("L")) leave++;
            }
            document.add(table);

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Total: " + attendanceList.size(), normalFont));
            document.add(new Paragraph("Present: " + present, normalFont));
            document.add(new Paragraph("Absent: " + absent, normalFont));
            document.add(new Paragraph("Leave: " + leave, normalFont));

            double percentage = (present * 100.0) / (present + absent + leave);
            document.add(new Paragraph("Percentage: " + String.format("%.2f", percentage) + "%", normalFont));

            document.close();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment",
                    "attendance_report_" + student.getRollNo() + ".pdf");

            return new ResponseEntity<>(out.toByteArray(), headers, HttpStatus.OK);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
