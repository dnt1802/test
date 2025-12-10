import React, { useState, useEffect } from 'react';
import { StageType, GameState } from './types';
import { generateCertificatePoem } from './services/gemini';
import { StageWrapper } from './components/StageWrapper';
import { Button } from './components/Button';
import { Droplets, Sun, Cloud, CloudRain, Waves, Trophy, CheckCircle, XCircle, ArrowDown } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentStage: StageType.INTRO,
    score: 0,
    studentName: '',
    history: []
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });
  const [poem, setPoem] = useState<string>('');
  const [loadingPoem, setLoadingPoem] = useState(false);

  // Stage 1 State
  const [stage1Selected, setStage1Selected] = useState<number | null>(null);
  
  // Stage 2 State
  const [stage2Matches, setStage2Matches] = useState<{[key: string]: boolean}>({
    sun: false,
    water: false
  });

  // Stage 3 State
  const [cloudsClicked, setCloudsClicked] = useState<number>(0);

  // Stage 4 State
  const [stage4Answer, setStage4Answer] = useState<string | null>(null);

  const handleStart = () => {
    if (!gameState.studentName.trim()) {
      alert("Hãy nhập tên của em nhé!");
      return;
    }
    setGameState(prev => ({ ...prev, currentStage: StageType.EVAPORATION }));
  };

  const addScore = (points: number) => {
    setGameState(prev => ({ ...prev, score: prev.score + points }));
  };

  const nextStage = (next: StageType) => {
    setFeedback({ type: null, msg: '' });
    setGameState(prev => ({ ...prev, currentStage: next }));
  };

  // --- STAGE 1 LOGIC (Evaporation) ---
  const handleStage1Answer = (optionIdx: number) => {
    setStage1Selected(optionIdx);
    if (optionIdx === 0) { // Correct: Mặt trời
      setFeedback({ type: 'success', msg: 'Chính xác! Mặt trời chiếu sáng làm nước nóng lên và bay hơi thành khí.' });
      addScore(10);
    } else {
      setFeedback({ type: 'error', msg: 'Ồ chưa đúng rồi. Cái gì nóng và to ở trên bầu trời nhỉ?' });
    }
  };

  // --- STAGE 2 LOGIC (Condensation) ---
  const handleStage2Drag = (item: string) => {
    // Simplified click interaction for "Drag"
    if (item === 'steam') {
       setFeedback({ type: 'success', msg: 'Đúng rồi! Hơi nước bay lên cao, gặp lạnh sẽ ngưng tụ thành những đám mây.' });
       setStage2Matches({ ...stage2Matches, water: true });
       addScore(10);
    }
  };

  // --- STAGE 3 LOGIC (Precipitation) ---
  const handleCloudClick = () => {
    const newCount = cloudsClicked + 1;
    setCloudsClicked(newCount);
    if (newCount >= 3) {
      setFeedback({ type: 'success', msg: 'Tuyệt vời! Mây nặng quá rồi, mưa rơi xuống thôi! Tí tách, tí tách...' });
      addScore(10);
    }
  };

  // --- STAGE 4 LOGIC (Collection) ---
  const handleStage4Answer = (ans: string) => {
    setStage4Answer(ans);
    if (ans === 'correct') {
      setFeedback({ type: 'success', msg: 'Chính xác! Nước mưa thấm xuống đất hoặc chảy ra sông, suối, rồi lại ra biển.' });
      addScore(10);
    } else {
      setFeedback({ type: 'error', msg: 'Chưa đúng. Nước mưa sẽ chảy đi đâu nhỉ? Hãy nhìn hình minh họa.' });
    }
  };

  // --- CERTIFICATE LOGIC ---
  useEffect(() => {
    if (gameState.currentStage === StageType.CERTIFICATE) {
      setLoadingPoem(true);
      generateCertificatePoem(gameState.studentName, gameState.score).then(text => {
        setPoem(text);
        setLoadingPoem(false);
      });
    }
  }, [gameState.currentStage, gameState.studentName, gameState.score]);


  // RENDERERS

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 text-white p-6 text-center">
      <div className="bg-white/20 p-8 rounded-3xl backdrop-blur-md shadow-xl max-w-lg w-full">
        <div className="mb-6 animate-float inline-block bg-white p-4 rounded-full shadow-lg">
          <Droplets size={64} className="text-blue-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-hand font-bold mb-4 text-yellow-300 drop-shadow-md">
          Hành Trình<br/>Giọt Nước Phiêu Lưu
        </h1>
        <p className="text-lg mb-8 text-blue-100">Cùng khám phá vòng tuần hoàn kỳ diệu của nước nhé!</p>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nhập tên của em..."
            className="w-full px-6 py-4 rounded-full text-blue-900 font-bold text-center text-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-inner"
            value={gameState.studentName}
            onChange={(e) => setGameState(prev => ({ ...prev, studentName: e.target.value }))}
          />
          <Button onClick={handleStart} variant="success" className="w-full text-xl py-4">
            Bắt đầu khám phá!
          </Button>
        </div>
      </div>
    </div>
  );

  const renderEvaporation = () => (
    <StageWrapper 
      title="Chặng 1: Bay Hơi" 
      description="Nước biến thành hơi như thế nào?" 
      score={gameState.score}
      showNext={!!feedback.type && feedback.type === 'success'}
      onNext={() => nextStage(StageType.CONDENSATION)}
      bgClass="bg-gradient-to-b from-yellow-100 to-blue-300"
    >
      <div className="bg-white rounded-3xl p-6 shadow-xl max-w-2xl w-full text-center">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Câu đố: Ai giúp nước nóng lên và bay hơi?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <button 
            onClick={() => handleStage1Answer(0)}
            className={`p-6 rounded-2xl border-4 flex flex-col items-center gap-4 transition-all ${stage1Selected === 0 ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-yellow-400'}`}
          >
            <Sun size={80} className="text-orange-500 animate-pulse" />
            <span className="font-bold text-xl">Ông Mặt Trời</span>
          </button>
          
          <button 
             onClick={() => handleStage1Answer(1)}
             className={`p-6 rounded-2xl border-4 flex flex-col items-center gap-4 transition-all ${stage1Selected === 1 ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}
          >
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-bold text-3xl">?</div>
            <span className="font-bold text-xl">Hòn Đá</span>
          </button>
        </div>

        {feedback.msg && (
          <div className={`p-4 rounded-xl font-bold text-lg animate-bounce ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {feedback.msg}
          </div>
        )}
      </div>
      
      {/* Visual Context */}
      <div className="absolute bottom-0 w-full h-32 bg-blue-500 opacity-50 z-0">
         <div className="w-full h-full flex items-end justify-center space-x-12 pb-4">
            <span className="text-white opacity-60 animate-float" style={{animationDelay: '0s'}}>↑</span>
            <span className="text-white opacity-60 animate-float" style={{animationDelay: '0.5s'}}>↑</span>
            <span className="text-white opacity-60 animate-float" style={{animationDelay: '1s'}}>↑</span>
            <span className="text-white opacity-60 animate-float" style={{animationDelay: '1.5s'}}>↑</span>
         </div>
      </div>
    </StageWrapper>
  );

  const renderCondensation = () => (
    <StageWrapper 
      title="Chặng 2: Ngưng Tụ" 
      description="Hơi nước bay lên cao gặp lạnh sẽ thế nào?" 
      score={gameState.score}
      showNext={stage2Matches.water}
      onNext={() => nextStage(StageType.PRECIPITATION)}
      bgClass="bg-gradient-to-b from-blue-300 to-white"
    >
      <div className="relative w-full max-w-3xl h-[400px] bg-sky-100 rounded-3xl border-4 border-sky-200 overflow-hidden shadow-2xl flex flex-col items-center justify-center">
        
        {!stage2Matches.water ? (
          <div className="text-center z-20">
            <h3 className="text-xl font-bold text-blue-900 mb-8">Bấm vào các hạt hơi nước để giúp chúng kết thành Mây!</h3>
            <button 
              onClick={() => handleStage2Drag('steam')}
              className="bg-white/80 p-4 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer animate-float"
            >
              <div className="flex gap-2">
                 <Droplets className="text-blue-400" />
                 <Droplets className="text-blue-400" />
                 <Droplets className="text-blue-400" />
              </div>
              <span className="font-bold text-blue-500 text-sm">Hơi nước</span>
            </button>
            <div className="mt-20">
                <div className="border-4 border-dashed border-gray-400 rounded-full w-32 h-32 flex items-center justify-center bg-gray-50 opacity-50 mx-auto">
                    <span className="text-gray-400 font-bold">Mây ở đây</span>
                </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-bounce z-20">
            <Cloud size={120} className="text-white drop-shadow-lg fill-white" />
            <h3 className="text-2xl font-bold text-blue-600 mt-4">Tuyệt vời! Đã tạo thành Mây!</h3>
          </div>
        )}

        {/* Feedback Area */}
        {feedback.msg && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 p-3 rounded-xl text-center font-bold text-green-700 shadow-md">
            {feedback.msg}
          </div>
        )}
      </div>
    </StageWrapper>
  );

  const renderPrecipitation = () => (
    <StageWrapper 
      title="Chặng 3: Mưa Rơi" 
      description="Mây nặng trĩu nước rồi, giúp mây làm mưa nào!" 
      score={gameState.score}
      showNext={cloudsClicked >= 3}
      onNext={() => nextStage(StageType.COLLECTION)}
      bgClass="bg-gray-200"
    >
       <div className="text-center mb-4">
          <p className="text-lg font-bold text-gray-700">Bấm liên tục vào đám mây để tạo mưa! ({cloudsClicked}/3)</p>
       </div>

       <div className="relative w-full h-80 flex justify-center items-start pt-10">
          <button 
            onClick={handleCloudClick}
            disabled={cloudsClicked >= 3}
            className={`transition-transform transform active:scale-95 focus:outline-none ${cloudsClicked >= 3 ? 'cursor-default' : 'cursor-pointer hover:scale-105'}`}
          >
             {cloudsClicked < 3 ? (
                <Cloud size={180} className={`text-gray-500 fill-gray-400 transition-colors duration-500 ${cloudsClicked === 1 ? 'text-gray-600' : cloudsClicked === 2 ? 'text-gray-700' : ''}`} />
             ) : (
                <CloudRain size={180} className="text-blue-700 fill-gray-600 animate-pulse" />
             )}
          </button>

          {/* Rain Animation */}
          {cloudsClicked >= 3 && (
            <div className="absolute top-40 w-full flex justify-center gap-8">
               <div className="animate-rain" style={{animationDelay: '0.1s'}}><Droplets className="text-blue-600" /></div>
               <div className="animate-rain" style={{animationDelay: '0.3s'}}><Droplets className="text-blue-600" /></div>
               <div className="animate-rain" style={{animationDelay: '0.5s'}}><Droplets className="text-blue-600" /></div>
               <div className="animate-rain" style={{animationDelay: '0.2s'}}><Droplets className="text-blue-600" /></div>
               <div className="animate-rain" style={{animationDelay: '0.7s'}}><Droplets className="text-blue-600" /></div>
            </div>
          )}
       </div>

       {feedback.msg && (
          <div className="mt-8 bg-blue-100 text-blue-900 p-4 rounded-xl font-bold border-2 border-blue-200 shadow-lg max-w-md text-center">
            {feedback.msg}
          </div>
        )}
    </StageWrapper>
  );

  const renderCollection = () => (
    <StageWrapper 
      title="Chặng 4: Thấm và Dòng Chảy" 
      description="Nước mưa rơi xuống sẽ đi đâu?" 
      score={gameState.score}
      showNext={stage4Answer === 'correct'}
      onNext={() => nextStage(StageType.CERTIFICATE)}
      bgClass="bg-gradient-to-b from-green-100 to-blue-200"
    >
      <div className="bg-white p-6 rounded-3xl shadow-xl max-w-2xl w-full">
        <h3 className="text-xl font-bold text-center mb-6 text-green-900">Hãy chọn hình ảnh đúng nhất!</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => handleStage4Answer('wrong')}
            className={`relative p-4 rounded-xl border-4 overflow-hidden h-48 group ${stage4Answer === 'wrong' ? 'border-red-500 opacity-70' : 'border-gray-200 hover:border-blue-300'}`}
          >
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                <span className="text-6xl mb-2">🚀</span>
                <span className="font-bold text-gray-600">Bay ra vũ trụ</span>
             </div>
             {stage4Answer === 'wrong' && <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center"><XCircle className="text-red-600 w-12 h-12" /></div>}
          </button>

          <button 
            onClick={() => handleStage4Answer('correct')}
            className={`relative p-4 rounded-xl border-4 overflow-hidden h-48 group ${stage4Answer === 'correct' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-300'}`}
          >
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-50">
                <div className="flex gap-4 items-end">
                   <Waves className="text-blue-500 w-12 h-12" />
                   <ArrowDown className="text-green-600 w-8 h-8" />
                </div>
                <span className="font-bold text-blue-800 mt-2 px-4 text-center">Thấm vào đất & chảy ra biển</span>
             </div>
             {stage4Answer === 'correct' && <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center"><CheckCircle className="text-green-600 w-12 h-12" /></div>}
          </button>
        </div>

        {feedback.msg && (
          <div className={`mt-6 p-3 rounded-lg text-center font-bold ${feedback.type === 'success' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
            {feedback.msg}
          </div>
        )}
      </div>
    </StageWrapper>
  );

  const renderCertificate = () => (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white border-8 border-double border-yellow-400 p-8 max-w-2xl w-full text-center shadow-2xl relative rounded-xl">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 p-4 rounded-full shadow-lg">
            <Trophy size={48} className="text-yellow-900" />
         </div>
         
         <h1 className="text-3xl md:text-4xl font-hand font-bold text-blue-900 mt-8 mb-2">CHỨNG NHẬN HOÀN THÀNH</h1>
         <div className="h-1 w-32 bg-blue-200 mx-auto mb-6"></div>

         <p className="text-lg text-gray-600 mb-2">Chúc mừng nhà thám hiểm tí hon</p>
         <h2 className="text-4xl font-bold text-blue-600 mb-6 uppercase tracking-wider">{gameState.studentName}</h2>
         
         <p className="text-gray-700 mb-6">
           Đã xuất sắc vượt qua hành trình "Vòng Tuần Hoàn Của Nước" với số điểm: <br/>
           <span className="text-3xl font-bold text-orange-500">{gameState.score}/40</span>
         </p>

         <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8 italic text-blue-800 font-hand text-xl leading-relaxed">
           {loadingPoem ? (
             <span className="animate-pulse">Đang viết thơ tặng bạn... ✨</span>
           ) : (
             poem || "Chúc mừng bạn đã hoàn thành xuất sắc nhiệm vụ!"
           )}
         </div>

         <Button onClick={() => window.location.reload()} variant="primary" className="mx-auto">
           Chơi lại từ đầu
         </Button>
      </div>
    </div>
  );

  switch (gameState.currentStage) {
    case StageType.INTRO: return renderIntro();
    case StageType.EVAPORATION: return renderEvaporation();
    case StageType.CONDENSATION: return renderCondensation();
    case StageType.PRECIPITATION: return renderPrecipitation();
    case StageType.COLLECTION: return renderCollection();
    case StageType.CERTIFICATE: return renderCertificate();
    default: return renderIntro();
  }
};

export default App;