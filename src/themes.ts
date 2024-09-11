import { createTheme } from "@mui/material";
import theme from "./core/theme/theme";

const Theme = createTheme({
    palette: {
        primary: {
            main: theme.COLORS.YELLOW2,
            dark: "#858796",
        },
        secondary: {
            main: theme.COLORS.YELLOW2,
            light: theme.COLORS.YELLOW,
            dark: "#eaeaea",
        },
    },
    typography: {
        fontFamily: "Nunito",
    },
    components: {
        MuiSpeedDialIcon: {
            styleOverrides: {
                root: {
                    color: "#fff",
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    borderColor: theme.COLORS.GRAY4,
                    borderWidth: "1px",
                },
            },
        },
        MuiButton: {
            defaultProps: {
                color: "secondary",
                variant: "contained",
                type: "submit",
            },
            variants: [
                {
                    props: { variant: "contained" },
                    style: ({ theme }) => ({
                        color: "#fff",
                        fontSize: "0.8pc",
                        border: "2px solid",
                        borderColor: "transparent",
                        fontWeight: "bold",
                        padding: "10px 20px 10px 20px",
                        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)",
                        letterSpacing: "0.1em",
                        "&:hover": {
                            backgroundColor: theme.palette.secondary.light,
                        },
                    }),
                },
                {
                    props: { variant: "outlined" },
                    style: () => ({
                        color: theme.COLORS.YELLOW2,
                        fontSize: "0.8pc",
                        border: "1px solid",
                        borderColor: theme.COLORS.YELLOW2,
                        fontWeight: "bold",
                        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)",
                        letterSpacing: "0.1em",
                        padding: "10px 20px 10px 20px",
                        "&:hover": {
                            backgroundColor: theme.COLORS.YELLOW2,
                            color: theme.COLORS.WHITE,
                        },
                    }),
                },
            ],
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    height: 10,
                },
            },
        },
        MuiStep: {
            styleOverrides: {
                root: {
                    padding: 0,
                    WebkitFlex: 0,
                    margin: 0,
                    flex: 0,
                },
            },
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
});

export default Theme;
