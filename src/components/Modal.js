import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
`;

const ModalContainer = styled(motion.div)`
  width: 50%;
  height: 70%;
  background-color: white;
  position: absolute;
  top: 45%;
  left: 80%;
  transform: translate(-80%, -45%);
  border-radius: 12px;

  @media (max-width: 768px) {
    width: 70%;     // Adjust width for mobile
    height: 65%;    // Adjust height for mobile
    top: 60%;
    left: 50%;
    transform: translate(-50%, -30%);
    border-radius: 8px;  // Smaller border radius for mobile
  }
`;

const modalVariant = {
  initial: { opacity: 0 },
  isOpen: { opacity: 1 },
  exit: { opacity: 0 }
};
const containerVariant = {
  initial: { top: "-50%", transition: { type: "spring" } },
  isOpen: { top: "50%" },
  exit: { top: "-50%" }
};

const Modal = ({ children, isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={"initial"}
          animate={"isOpen"}
          exit={"exit"}
          variants={modalVariant}
        >
          <ModalContainer variants={containerVariant}>
            {children}
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default Modal;
