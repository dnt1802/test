import { GoogleGenAI } from "@google/genai";

export const generateCertificatePoem = async (studentName: string, score: number): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return `Chúc mừng ${studentName} đã hoàn thành xuất sắc nhiệm vụ! Em là một nhà thám hiểm tài ba.`;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Hãy viết một bài thơ ngắn (4 dòng) bằng tiếng Việt vui tươi, vần điệu dành cho trẻ em lớp 4.
      Nội dung chúc mừng học sinh tên là "${studentName}" đã hoàn thành xuất sắc trò chơi tìm hiểu về "Vòng tuần hoàn của nước".
      Điểm số của bạn ấy là ${score}/40.
      Nếu điểm cao, hãy khen ngợi sự thông minh. Nếu điểm thấp hơn, hãy khen ngợi sự nỗ lực.
      Không dùng markdown, chỉ trả về text thuần.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating poem:", error);
    return `Chúc mừng ${studentName} đã hoàn thành xuất sắc nhiệm vụ! Em là một nhà thám hiểm tài ba.`;
  }
};