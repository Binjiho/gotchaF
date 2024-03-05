import { Form, Button } from "react-bootstrap";
import PlusIcon from "@/public/icons/system/add-line.svg";
import MinusIcon from "@/public/icons/system/minus-line.svg";
import { useEffect, useState } from "react";
import BottomSheetModal from "@/components/modal/BottomSheetModal";
import UseAgreeTerm from "@/components/terms/UseAgreeTerm";
import PersonalAgreeTerm from "@/components/terms/personalAgreeTerm";

export default function AgreeTerms({ setValue }) {
  const [serviceCheckView, setServiceCheckView] = useState(false);
  const [adCheckView, setAdCheckView] = useState(false);

  const [requiredAllCheck, setRequiredAllCheck] = useState(false);
  const [useAgreeCheck, setUseAgreeCheck] = useState(false);
  const [personalAgreeCheck, setPersonalAgreeCheck] = useState(false);

  const [adAllCheck, setAdAllCheck] = useState(false);
  const [messageAgreeCheck, setMessageAgreeCheck] = useState(false);
  const [emailAgreeCheck, setEmailAgreeCheck] = useState(false);

  const [useAgreeModal, setUseAgreeModal] = useState(false);
  const [personalAgreeModal, setPersonalAgreeModal] = useState(false);

  const checkRequiredAll = () => {
    if (useAgreeCheck && personalAgreeCheck) {
      setRequiredAllCheck(true);
    } else {
      setRequiredAllCheck(false);
    }
  };

  const checkAddAll = () => {
    if (messageAgreeCheck && emailAgreeCheck) {
      setAdAllCheck(true);
    } else {
      setAdAllCheck(false);
    }
  };

  useEffect(() => {
    checkRequiredAll();

    if (useAgreeCheck || personalAgreeCheck) {
      setServiceCheckView(true);
    }
  }, [useAgreeCheck, personalAgreeCheck]);

  useEffect(() => {
    checkAddAll();

    if (messageAgreeCheck || emailAgreeCheck) {
      setAdCheckView(true);
    }
  }, [messageAgreeCheck, emailAgreeCheck]);

  useEffect(() => {
    setValue({
      use: useAgreeCheck,
      personal: personalAgreeCheck,
      message: messageAgreeCheck,
      email: emailAgreeCheck,
    });
  }, [useAgreeCheck, personalAgreeCheck, messageAgreeCheck, emailAgreeCheck]);

  const toggleRequiredAllCheck = value => {
    setUseAgreeCheck(value);
    setPersonalAgreeCheck(value);
  };

  const toggleAdAllCheck = value => {
    setMessageAgreeCheck(value);
    setEmailAgreeCheck(value);
  };

  const useAgreeShow = e => {
    e.preventDefault();
    setUseAgreeModal(true);
  };

  const personalAgreeShow = e => {
    e.preventDefault();
    setPersonalAgreeModal(true);
  };

  return (
    <div className={`flex flex-column gap-[20px] text-[14px]`}>
      <div className={`flex flex-column gap-[20px]`}>
        <div className={`flex items-center justify-between`}>
          <Form.Check
            inline
            label="[필수] 만 14세 이상이며 모두 동의합니다."
            type={`checkbox`}
            name="requiredAllCheck"
            id={`requiredAllCheck`}
            checked={requiredAllCheck}
            onChange={e => toggleRequiredAllCheck(e.target.checked)}
          />
          <div className={`min-w-fit cursor-pointer`}>
            {serviceCheckView ? (
              <MinusIcon width={20} onClick={() => setServiceCheckView(false)} />
            ) : (
              <PlusIcon width={20} onClick={() => setServiceCheckView(true)} />
            )}
          </div>
        </div>
        {serviceCheckView && (
          <div className={`pl-[30px] flex flex-column gap-[20px]`}>
            <div className={`flex items-center justify-between`}>
              <Form.Check
                inline
                label="이용약관 동의"
                type={`checkbox`}
                name="useAgreeCheck"
                id={`useAgreeCheck`}
                checked={useAgreeCheck}
                onChange={e => setUseAgreeCheck(e.target.checked)}
              />
              <button
                onClick={useAgreeShow}
                className={`min-w-fit text-gray7 text-[13px] text-decoration-underline`}>
                내용보기
              </button>
            </div>
            <div className={`flex items-center justify-between`}>
              <Form.Check
                inline
                label="개인정보 수집 및 이용 동의"
                type={`checkbox`}
                name="personalAgreeCheck"
                id={`personalAgreeCheck`}
                checked={personalAgreeCheck}
                onChange={e => setPersonalAgreeCheck(e.target.checked)}
              />
              <button
                onClick={personalAgreeShow}
                className={`min-w-fit text-gray7 text-[13px] text-decoration-underline`}>
                내용보기
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={`flex flex-column gap-[20px]`}>
        <div className={`flex items-center justify-between`}>
          <Form.Check
            inline
            label="[선택] 광고성 정보 수신에 모두 동의합니다."
            type={`checkbox`}
            name="adAllCheck"
            id={`adAllCheck`}
            checked={adAllCheck}
            onChange={e => toggleAdAllCheck(e.target.checked)}
          />
          <div className={`min-w-fit cursor-pointer`}>
            {adCheckView ? (
              <MinusIcon width={20} onClick={() => setAdCheckView(false)} />
            ) : (
              <PlusIcon width={20} onClick={() => setAdCheckView(true)} />
            )}
          </div>
        </div>
        {adCheckView && (
          <div className={`pl-[30px] flex flex-column gap-[20px]`}>
            <div className={`flex items-center justify-between`}>
              <Form.Check
                inline
                label="문자 메시지"
                type={`checkbox`}
                name="messageAgreeCheck"
                id={`messageAgreeCheck`}
                checked={messageAgreeCheck}
                onChange={e => setMessageAgreeCheck(e.target.checked)}
              />
            </div>
            <div className={`flex items-center justify-between`}>
              <Form.Check
                inline
                label="이메일"
                type={`checkbox`}
                name="emailAgreeCheck"
                id={`emailAgreeCheck`}
                checked={emailAgreeCheck}
                onChange={e => setEmailAgreeCheck(e.target.checked)}
              />
            </div>
          </div>
        )}
      </div>
      <BottomSheetModal show={useAgreeModal} setShow={setUseAgreeModal}>
        <p type={`left`}>
          같차 서비스
          <br />
          이용약관
        </p>
        <div type={`content`} className={`inner`}>
          <div className={`pb-[80px]`}>
            <UseAgreeTerm />
          </div>
          <div className={`bottom-fixed btns`}>
            <Button
              className={`w-full`}
              variant="black"
              size="50"
              onClick={() => setUseAgreeModal(false)}>
              닫기
            </Button>
          </div>
        </div>
      </BottomSheetModal>
      <BottomSheetModal show={personalAgreeModal} setShow={setPersonalAgreeModal}>
        <p type={`left`}>
          개인정보 수집 및<br />
          이용동의
        </p>
        <div type={`content`} className={`inner`}>
          <div className={`pb-[80px]`}>
            <PersonalAgreeTerm />
          </div>
          <div className={`bottom-fixed btns`}>
            <Button
              className={`w-full`}
              variant="black"
              size="50"
              onClick={() => setPersonalAgreeModal(false)}>
              닫기
            </Button>
          </div>
        </div>
      </BottomSheetModal>
    </div>
  );
}
