import { Box, Typography } from '@mui/material';
import React from 'react';
import theme from '../../../core/theme/theme';
import { capitalizeFirstLetter } from '../../../core/utils/globalFunctions';

interface IStyledStatus {
    status: string;
}

const StyledStatus = (props: IStyledStatus) => {
    const { status } = props;

    const statusType = (status: string) => {
        switch (status) {
            case "Receita":
                return "green";
            case "CADASTRADO":
                return "yellow";
            case "Despesa":
                return "red";
            default:
                return "default";
        }
    }

    const getStyles = (status: string) => {
        switch (statusType(status)) {
            case "green":
                return {
                    borderColor: theme.COLORS.GREEN2,
                    backgroundColor: `rgba(60, 176, 67, 0.2)`,
                    color: theme.COLORS.GREEN2,
                };
            case "yellow":
                return {
                    borderColor: theme.COLORS.YELLOW,
                    backgroundColor: `rgba(255, 221, 37, 0.2)`,
                    color: theme.COLORS.YELLOW,
                };
            case "red":
                return {
                    borderColor: theme.COLORS.RED,
                    backgroundColor: `rgba(255, 0, 0, 0.2)`,
                    color: theme.COLORS.RED,
                };
            default:
                return null;
        }
    }

    const styles = getStyles(status);

    if (!styles) {
        return (
            <Typography>
                {capitalizeFirstLetter(status)}
            </Typography>
        );
    }

    return (
        <Box sx={{
            border: "2px solid",
            borderRadius: "20px",
            display: "flex",
            padding: "0.3rem",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "fit-content",
            gap: 1,
            ...styles,
        }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: styles.color }}>
            </Box>
            <Typography sx={{ fontWeight: "bold", fontSize: "0.8rem", color: styles.color }}>
                {capitalizeFirstLetter(status)}
            </Typography>
        </Box>
    )
}

export default StyledStatus;
