import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIService } from '@apis/axios';
import styles from './EditPage.module.css';

const EditPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    ingredient: '',
    recruitCount: '',
    quantity: ''
  });

  // AI 분석 결과 상태 (읽기 전용)
  const [analysisResult, setAnalysisResult] = useState({
    name: '',
    conditionScore: 0,
    analysis: ''
  });

  // 업로드된 이미지 상태
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 신선도 검증
  const isLowFreshness = analysisResult.conditionScore > 0 && analysisResult.conditionScore < 7;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 카메라 클릭 핸들러
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 핸들러
  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이미지 파일 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 체크 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    try {
      setIsAnalyzing(true);
      
      // 이미지 미리보기 설정
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);

      // FormData로 이미지 전송
      const formData = new FormData();
      formData.append('foodImage', file);

      console.log('이미지 분석 API 호출 중...');
      console.log('파일 정보:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      });
      console.log('FormData 내용:', Array.from(formData.entries()));

      // Content-Type 헤더를 제거하여 브라우저가 자동으로 설정하도록 함
      const response = await APIService.private.post('/api/analysis', formData);

      console.log('API 응답:', response);

      if (response.success && response.data) {
        // AI 분석 결과 업데이트
        setAnalysisResult({
          name: response.data.name || '',
          conditionScore: response.data.conditionScore || 0,
          analysis: response.data.analysis || ''
        });

        // 식재료 이름을 폼 데이터에도 자동 입력 (읽기 전용으로 만들 예정)
        setFormData(prev => ({
          ...prev,
          ingredient: response.data.name || ''
        }));

        console.log('이미지 분석 완료:', response.data);
      } else {
        throw new Error('분석 결과를 받아올 수 없습니다.');
      }
    } catch (error) {
      console.error('이미지 분석 실패:', error);
      console.error('에러 상세 정보:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
      
      let errorMessage = '이미지 분석 중 오류가 발생했습니다.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.response?.status === 413) {
        errorMessage = '파일 크기가 너무 큽니다. 더 작은 이미지를 업로드해주세요.';
      } else if (error.response?.status === 415) {
        errorMessage = '지원하지 않는 파일 형식입니다.';
      }
      
      alert(errorMessage);
      
      // 실패 시 상태 초기화
      setUploadedImage(null);
      setAnalysisResult({
        name: '',
        conditionScore: 0,
        analysis: ''
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    // 신선도 검증
    if (isLowFreshness) {
      alert('신선도가 7 미만이므로 작성이 불가능합니다.');
      return;
    }

    // 필수 필드 검증
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    if (!formData.recruitCount.trim()) {
      alert('모집 인원을 입력해주세요.');
      return;
    }
    if (!formData.quantity.trim()) {
      alert('개수를 입력해주세요.');
      return;
    }
    if (!uploadedImage) {
      alert('이미지를 업로드해주세요.');
      return;
    }

    try {
      console.log('게시글 작성 API 호출 중...');

      // FormData 생성
      const submitFormData = new FormData();
      
      // 이미지 파일 추가 (원본 파일 사용)
      const fileInput = fileInputRef.current;
      const originalFile = fileInput?.files?.[0];
      if (originalFile) {
        submitFormData.append('image', originalFile);
      }

      // request 객체 생성
      const requestData = {
        title: formData.title,
        maxMember: parseInt(formData.recruitCount),
        content: formData.content,
        name: analysisResult.name || formData.ingredient,
        conditionScore: analysisResult.conditionScore,
        analysis: analysisResult.analysis
      };

      // quantity 필드가 필요한 경우 추가
      if (formData.quantity) {
        requestData.quantity = parseInt(formData.quantity);
      }

      // request를 JSON 문자열로 추가
      submitFormData.append('request', JSON.stringify(requestData));

      console.log('제출 데이터:', {
        image: originalFile?.name,
        request: requestData
      });

      const response = await APIService.private.post('/api/foods', submitFormData);

      console.log('게시글 작성 성공:', response);

      if (response.success) {
        alert('게시글이 성공적으로 작성되었습니다!');
        navigate('/');
      } else {
        throw new Error(response.message || '게시글 작성에 실패했습니다.');
      }

    } catch (error) {
      console.error('게시글 작성 실패:', error);
      console.error('에러 상세:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      let errorMessage = '게시글 작성 중 오류가 발생했습니다.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      alert(errorMessage);
    }
  };

  return (
    <div className={styles.editPage}>
      {/* 헤더 영역 */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src="/src/assets/images/edit/back-arrow.svg" alt="뒤로가기" />
        </button>
        {/* 신선도 경고 메시지 */}
        {isLowFreshness && (
          <div className={styles.warningMessage}>
            신선도 7 미만시 작성이 불가능해요!
          </div>
        )}
      </div>

      {/* 카메라 영역 */}
      <div className={styles.cameraSection}>
        <div 
          className={`${styles.cameraBox} ${isAnalyzing ? styles.analyzing : ''}`}
          onClick={handleCameraClick}
        >
          {uploadedImage ? (
            <img 
              src={uploadedImage} 
              alt="업로드된 이미지" 
              className={styles.uploadedImage}
            />
          ) : (
            <img src="/src/assets/images/edit/camera-icon.svg" alt="카메라" />
          )}
          {isAnalyzing && (
            <div className={styles.loadingOverlay}>
              <div className={styles.spinner}></div>
            </div>
          )}
        </div>
        <div className={styles.freshnessInfo}>
          <span>신선도 검사</span>
          <span>{analysisResult.conditionScore} / 10</span>
        </div>
        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {/* 폼 영역 */}
      <div className={styles.formSection}>
        {/* 제목 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>제목</label>
          <input
            type="text"
            className={styles.input}
            placeholder="제목을 입력하세요"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
        </div>
        {/* 식재료 이름 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>식재료 이름</label>
          <input
            type="text"
            className={`${styles.input} ${analysisResult.name ? styles.readonly : ''}`}
            placeholder={analysisResult.name ? "" : "이미지를 업로드하면 자동으로 인식됩니다"}
            value={formData.ingredient}
            onChange={(e) => {
              if (!analysisResult.name) {
                handleInputChange('ingredient', e.target.value);
              }
            }}
            readOnly={!!analysisResult.name}
          />
          {analysisResult.name && (
            <div className={styles.aiLabel}>AI 자동 인식</div>
          )}
        </div>

        {/* 모집 인원 / 개수 */}
        <div className={styles.inputGroup}>
          <div className={styles.doubleSection}>
            <div className={styles.sectionItem}>
              <label className={styles.label}>모집 인원</label>
              <input
                type="text"
                className={styles.input}
                placeholder="인원 수"
                value={formData.recruitCount}
                onChange={(e) => handleInputChange('recruitCount', e.target.value)}
              />
            </div>
            <div className={styles.sectionItem}>
              <label className={styles.label}>개수</label>
              <input
                type="text"
                className={styles.input}
                placeholder="개수"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 내용 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>내용</label>
          <textarea
            className={styles.textarea}
            placeholder="내용을 입력하세요."
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
          />
        </div>

        {/* AI 분석 내용 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>AI 분석 내용</label>
          <div className={styles.aiContent}>
            {analysisResult.analysis ? (
              <span>{analysisResult.analysis}</span>
            ) : (
              <span className={styles.placeholder}>이미지를 업로드하면 AI 분석 결과가 표시됩니다</span>
            )}
          </div>
          {analysisResult.analysis && (
            <div className={styles.aiLabel}>AI 자동 분석</div>
          )}
        </div>
      </div>

      {/* 안내 문구 */}
      <div className={styles.notice}>
        신선도를 위해 등록 최대기간은 3일 입니다.
      </div>

      {/* 작성 완료 버튼 */}
      <div className={styles.submitContainer}>
        <button 
          className={`${styles.submitButton} ${isLowFreshness ? styles.disabled : ''}`} 
          onClick={handleSubmit}
          disabled={isLowFreshness}
        >
          작성 완료
        </button>
        {isLowFreshness && (
          <div className={styles.disabledLabel}>수정불가</div>
        )}
      </div>
    </div>
  );
};

export default EditPage;
