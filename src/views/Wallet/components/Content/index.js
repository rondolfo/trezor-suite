import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loader from 'components/Loader';
import { FONT_SIZE } from 'config/variables';
import colors from 'config/colors';
import FirmwareUnsupported from './components/FirmwareUnsupported';

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 40px 35px 40px 35px;
`;

const Loading = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const Text = styled.div`
    font-size: ${FONT_SIZE.BIGGER};
    color: ${colors.TEXT_SECONDARY};
    margin-left: 10px;
`;

const Message = styled.div`
    font-size: ${FONT_SIZE.BASE};
    color: ${colors.TEXT_PRIMARY};
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
`;

const Content = ({
    children,
    title,
    message,
    type,
    networkShortcut,
    isLoading = false,
}) => (
    <Wrapper>
        {(!isLoading) && children}
        {isLoading && (type === 'progress' || type === 'info') && (
            <Loading>
                <Row>
                    {type === 'progress' && <Loader size={30} />}
                    <Text>{title || 'Initializing accounts'}</Text>
                </Row>
                {message && <Message>{message}</Message>}
            </Loading>
        )}
        {isLoading && (type === 'fwNotSupported') && (
            <FirmwareUnsupported title={title} message={message} networkShortcut={networkShortcut} />
        )}
    </Wrapper>
);

Content.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
    isLoading: PropTypes.bool,
    title: PropTypes.string,
    message: PropTypes.string,
    type: PropTypes.string,
    networkShortcut: PropTypes.string,
};

export default Content;
